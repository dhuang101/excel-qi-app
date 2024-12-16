import { MongoClient } from "mongodb"

interface ValueCount {
	_id: string
	count: number
}

async function GetCounts() {
	// connect to db
	const client = new MongoClient(process.env.DB_CONNECTION_URI as string)
	const collection = client.db("main").collection("collection")
	const attributes = ["outcm_hosp_discharge_loc"]

	// First, get the total number of documents in the collection
	const totalDocuments = await collection.countDocuments()
	// Explicitly type the results object
	const results: {
		totalDocuments: number
		counts: Record<string, { _id: string; count: number }[]>
	} = {
		totalDocuments,
		counts: {},
	}

	for (const attribute of attributes) {
		const pipeline = [
			{
				$project: {
					[attribute]: {
						$ifNull: [`$${attribute}`, "N/A"], // Replace null with "N/A"
					},
				},
			},
			{ $group: { _id: `$${attribute}`, count: { $sum: 1 } } },
			{ $sort: { count: -1 } },
		]

		const values = await collection
			.aggregate<ValueCount>(pipeline)
			.toArray()
		results.counts[attribute] = values
	}

	return results
}

// handler for any calls to this endpoint
export default async function handler(req: any, res: any) {
	try {
		const results = await GetCounts()
		res.status(200).json(results)
	} catch (err) {
		res.status(500).json(err)
	}
}
