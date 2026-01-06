import { google } from "googleapis"
import { MongoClient } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"

export const config = {
	api: {
		bodyParser: true,
	},
}

const uri = process.env.DB_CONNECTION_URI as string
let cachedClient: MongoClient | null = null

async function getClient() {
	if (!uri) throw new Error("Missing DB_CONNECTION_URI")
	if (!cachedClient) {
		cachedClient = new MongoClient(uri)
		await cachedClient.connect()
	}
	return cachedClient
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" })
	}

	try {
		const { filename, driveFileId } = req.body
		if (!driveFileId) {
			return res.status(400).json({ error: "Missing driveFileId" })
		}

		const auth = new google.auth.GoogleAuth({
			credentials: JSON.parse(process.env.GOOGLE_DRIVE_KEY!),
			scopes: ["https://www.googleapis.com/auth/drive"],
		})

		const drive = google.drive({ version: "v3", auth })

		await drive.files.delete({
			fileId: driveFileId,
			supportsAllDrives: true,
		})

		// remove document from mongodb
		const client = await getClient()
		await client.connect()
		const collection = client.db("main").collection("file-repository")
		const result = await collection.deleteOne({ filename: filename })

		if (result.deletedCount === 0) {
			console.warn(`No MongoDB record found for filename: ${filename}`)
		}

		return res.status(200).json({ message: "File deleted successfully" })
	} catch (err: any) {
		console.error("Error at database/file-repo/deleteFile :", err)
		res.status(500).json({ error: "Internal Server Error" })
	}
}
