import { google } from "googleapis"
import { NextApiRequest, NextApiResponse } from "next"

export const config = {
	api: {
		bodyParser: true,
	},
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" })
	}

	try {
		const { driveFileId } = req.body
		if (!driveFileId) {
			return res.status(400).json({ error: "Missing driveFileId" })
		}

		const auth = new google.auth.GoogleAuth({
			credentials: JSON.parse(process.env.GOOGLE_SERVICE_KEY as string),
			scopes: ["https://www.googleapis.com/auth/drive"],
		})

		const drive = google.drive({ version: "v3", auth })

		await drive.files.delete({
			fileId: driveFileId,
			supportsAllDrives: true,
		})

		return res
			.status(200)
			.json({ success: true, message: "File deleted successfully" })
	} catch (err: any) {
		console.error("Error at database/file-repo/downloadFile :", err)
		res.status(500).json({ error: "Internal Server Error" })
	}
}
