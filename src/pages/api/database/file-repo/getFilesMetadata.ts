import { MongoClient } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"

type ParamsType = {
	role: string
	sites: string[]
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

async function GetFilesMetadata(params: ParamsType) {
	const client = await getClient()
	await client.connect()
	const db = client.db("main")
	const collection = db.collection("file-repository")

	let sites: string[] = params.sites
	if (
		(!sites || sites.length === 0) &&
		(params.role === "admin" || params.role === "global-viewer")
	) {
		sites = await collection.distinct("redcap_data_access_group")
	}

	const query = { redcap_data_access_group: { $in: sites } }
	const results = await collection
		.find(query, {
			projection: {
				_id: 0,
			},
		})
		.toArray()

	return results
}

// handler for any calls to this endpoint
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const params = req.body as ParamsType

	try {
		const results = await GetFilesMetadata(params)
		res.status(200).json(results)
	} catch (err) {
		console.error("Error at database/file-repo/getFilesMetadata :", err)
		res.status(500).json({ error: "Internal Server Error" })
	}
}
