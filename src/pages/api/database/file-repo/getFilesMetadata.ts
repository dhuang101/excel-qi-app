import { MongoClient } from "mongodb"

type ParamsType = {
	role: string
	sites: string[]
}

async function GetFilesMetadata(params: ParamsType) {
	const client = new MongoClient(process.env.DB_CONNECTION_URI as string)
	try {
		await client.connect()
		const db = client.db("main")
		const collection = db.collection("file-repo.files")

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
					filename: 1,
					path: 1,
					redcap_data_access_group: 1,
				},
			})
			.toArray()

		return results
	} finally {
		await client.close()
	}
}

// handler for any calls to this endpoint
export default async function handler(req: any, res: any) {
	const params = req.body as ParamsType

	try {
		const results = await GetFilesMetadata(params)
		res.status(200).json(results)
	} catch (err) {
		res.status(500).json({ error: "Internal Server Error" })
	}
}
