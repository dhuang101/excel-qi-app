import { FindOptions, MongoClient } from "mongodb"

async function GetPatients(params: any) {
	// connect to db
	const client = new MongoClient(process.env.DB_CONNECTION_URI as string)
	const collection = client.db("main").collection("collection")
	// options for find
	const query = { record_id: { $regex: params.searchInput, $options: "i" } }
	const options = {
		// sort ascending
		sort: { record_id: 1 },
		// Include only the particular fields
		projection: { _id: 0, record_id: 1, hospadm_date_time: 1, sex: 1 },
	} as FindOptions
	// run find
	const results = await collection.find(query, options).toArray()
	return results
}

// handler for any calls to this endpoint
export default async function handler(req: any, res: any) {
	const params = req.query

	try {
		const results = await GetPatients(params)
		res.status(200).json(results)
	} catch (err) {
		res.status(500).json(err)
	}
}
