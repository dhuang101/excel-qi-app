import { MongoClient, GridFSBucket } from "mongodb"

type ParamsType = {
	role: string
	sites: string[]
	filename: string
}

let cachedClient: MongoClient | null = null

async function getClient() {
	if (!cachedClient) {
		cachedClient = new MongoClient(process.env.DB_CONNECTION_URI as string)
		await cachedClient.connect()
	}
	return cachedClient
}

// Utility to check if arrays overlap
function findOverlap(array1: string[], array2: string[]) {
	return array1.some((i) => array2.includes(i))
}

async function DownloadFile({ filename, sites, role }: ParamsType, res: any) {
	const client = await getClient()
	const db = client.db("main")
	const bucket = new GridFSBucket(db, { bucketName: "file-repo" })

	// Find the file by filename
	const fileDoc = await db.collection("file-repo.files").findOne({ filename })
	if (!fileDoc) {
		res.status(404).json({ error: "File not found" })
		return
	}

	// Check access for site-viewer role
	if (
		role === "site-viewer" &&
		!findOverlap(sites, fileDoc.redcap_data_access_group)
	) {
		res.status(403).json({ error: "Access denied" })
		return
	}

	// Set headers to trigger browser download
	res.setHeader(
		"Content-Type",
		fileDoc.contentType || "application/octet-stream"
	)
	res.setHeader(
		"Content-Disposition",
		`attachment; filename="${encodeURIComponent(fileDoc.filename)}"`
	)

	const downloadStream = bucket.openDownloadStream(fileDoc._id)
	downloadStream.pipe(res)

	downloadStream.on("error", (err) => {
		console.error(err)
		if (!res.headersSent)
			res.status(500).json({ error: "Error streaming file" })
	})
}

export default async function handler(req: any, res: any) {
	const params = req.body as ParamsType

	try {
		await DownloadFile(params, res)
	} catch (err) {
		console.error(err)
		if (!res.headersSent)
			res.status(500).json({ error: "Internal Server Error" })
	}
}
