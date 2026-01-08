import { MongoClient } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"

// this api will update any users attributes in the permissions collection effectively
// adjusting their access to the application

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

// this api fetches all the unique years in the column ecmo_start_date_time for the summary statistics page
async function GetAvailableYears() {
	const client = await getClient()
	const collection = client.db("main").collection("excel-data")

	const years = await collection
		.aggregate([
			{
				$project: {
					year: { $year: "$ecmo_start_date_time" },
				},
			},
			{
				$group: {
					_id: "$year",
				},
			},
			{
				$sort: { _id: 1 },
			},
		])
		.toArray()

	const yearList = years.map((item) => item._id).filter((y) => y !== null)
	return yearList
}

// handler for any calls to this endpoint
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const results = await GetAvailableYears()
		res.status(200).json(results)
	} catch (err) {
		console.error("Error at database/summary/getAvailableYears :", err)
		res.status(500).json({ error: "Internal Server Error" })
	}
}
