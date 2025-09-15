import type { NextApiRequest, NextApiResponse } from "next"
import { MongoClient } from "mongodb"
import { google } from "googleapis"
import getRawBody from "raw-body"

type ParamsType = {
	role: string
	sites: string[]
	filename: string
}

export const config = {
	api: {
		bodyParser: false,
		responseLimit: false,
	},
}

let client: MongoClient | null = null
async function getClient() {
	if (!client) {
		client = new MongoClient(process.env.DB_CONNECTION_URI as string)
		await client.connect()
	}
	return client
}

// utility to check if arrays overlap
function findOverlap(array1: string[], array2: string[]) {
	return array1.some((i) => array2.includes(i))
}

async function DownloadFile(
	{ filename, sites, role }: ParamsType,
	res: NextApiResponse
) {
	// connect to db
	const client = await getClient()
	await client.connect()
	const db = client.db("main")
	const collection = db.collection("file-repository")
	// fetch document
	const document = await collection.findOne({ filename })
	if (!document) {
		res.status(404).json({ error: "File not found in repository" })
		return
	}
	// Check access for site-viewer role
	if (
		role === "site-viewer" &&
		!findOverlap(sites, document.redcap_data_access_group)
	) {
		res.status(403).json({ error: "Access denied" })
		return
	}
	// find file id
	const driveFileId = document.driveFileId
	if (!driveFileId) {
		res.status(500).json({ error: "No driveFileId found for this file" })
		return
	}
	// fetch from google drive
	const auth = new google.auth.GoogleAuth({
		credentials: JSON.parse(process.env.GOOGLE_DRIVE_KEY as string),
		scopes: ["https://www.googleapis.com/auth/drive.readonly"],
	})
	const drive = google.drive({ version: "v3", auth })
	const response = await drive.files.get(
		{ fileId: driveFileId, alt: "media" },
		{ responseType: "stream" }
	)
	// optionally fetch file metadata (to get original name / mime type)
	const metadata = await drive.files.get({
		fileId: driveFileId,
		fields: "name, mimeType",
	})
	// stream file to frontend
	res.setHeader(
		"Content-Disposition",
		`attachment; filename="${metadata.data.name}"`
	)
	res.setHeader("X-Filename", metadata.data.name as string)
	res.setHeader(
		"Content-Type",
		metadata.data.mimeType || "application/octet-stream"
	)
	response.data.pipe(res)
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const raw = await getRawBody(req)
	const params = JSON.parse(raw.toString()) as ParamsType

	try {
		await DownloadFile(params, res)
	} catch (err) {
		console.error("Error at database/file-repo/downloadFile :", err)
		res.status(500).json({ error: "Internal Server Error" })
	}
}
