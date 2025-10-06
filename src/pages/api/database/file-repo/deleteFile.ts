import { google } from "googleapis"
import { MongoClient } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"

export const config = {
	api: {
		bodyParser: true,
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

		const check = await drive.files.get({
			fileId: driveFileId,
			fields: "id, name, parents",
			supportsAllDrives: true,
		})

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
		console.error("Error at database/file-repo/downloadFile :", err)
		res.status(500).json({ error: "Internal Server Error" })
	}
}
