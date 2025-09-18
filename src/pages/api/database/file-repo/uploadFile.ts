import type { NextApiRequest, NextApiResponse } from "next"
import { google } from "googleapis"
import formidable from "formidable"
import fs from "fs"
import { MongoClient } from "mongodb"

export const config = {
	api: {
		bodyParser: false, // let formidable handle multipart form
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

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" })
	}

	const form = formidable({ multiples: false })

	form.parse(req, async (err, fields, files) => {
		if (err) {
			console.error("Form parsing error:", err)
			return res.status(500).json({ error: "File parsing failed" })
		}

		const uploadedFile = files.file
		if (!uploadedFile) {
			return res.status(400).json({ error: "No file provided" })
		}

		const file = Array.isArray(uploadedFile)
			? uploadedFile[0]
			: uploadedFile

		const fileName = fields.customName?.toString() || file.originalFilename
		const sites = fields.sites ? JSON.parse(fields.sites.toString()) : []

		try {
			// Authenticate service account
			const auth = new google.auth.GoogleAuth({
				credentials: JSON.parse(process.env.GOOGLE_DRIVE_KEY!),
				scopes: ["https://www.googleapis.com/auth/drive.file"],
			})

			const drive = google.drive({ version: "v3", auth })

			// Upload file to Drive
			const response = await drive.files.create({
				requestBody: {
					name: fileName,
					parents: process.env.GOOGLE_DRIVE_FOLDER_ID
						? [process.env.GOOGLE_DRIVE_FOLDER_ID]
						: undefined,
				},
				media: {
					mimeType: file.mimetype || "application/pdf",
					body: fs.createReadStream(file.filepath),
				},
				fields: "id, name, webViewLink, webContentLink",
			})

			// Save metadata to MongoDB
			const client = await getClient()
			await client.connect()
			const db = client.db("main")
			await db.collection("file-repository").insertOne({
				filename: fileName,
				driveFileId: response.data.id,
				redcap_data_access_group: sites,
			})

			return res.status(200).json({
				message: "Upload successful",
				file: response.data,
			})
		} catch (err) {
			console.error("Error at database/file-repo/uploadFile :", err)
			return res.status(500).json({ error: "Internal Server Error" })
		}
	})
}
