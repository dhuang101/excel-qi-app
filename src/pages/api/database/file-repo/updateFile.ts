import { MongoClient } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"

type ParamsType = {
	filename: string
	newName: string
	newSites: string[]
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

async function UpdateFile({ filename, newName, newSites }: ParamsType) {
	const client = await getClient()
	const collection = client.db("main").collection("file-repository")
	const result = await collection.updateOne(
		{ filename: filename },
		{
			$set: {
				filename: newName,
				redcap_data_access_group: newSites,
			},
		}
	)
	if (result.matchedCount === 0) {
		throw new Error("File not found")
	}
}

// handler for any calls to this endpoint
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const params = req.body

	try {
		UpdateFile(params)
		res.status(200).json({ message: "File metadata updated successfully" })
	} catch (err) {
		console.error("Error at database/import/updateFile :", err)
		res.status(500).json({ error: "Internal Server Error" })
	}
}
