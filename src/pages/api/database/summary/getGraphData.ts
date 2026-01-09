import { MongoClient } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"

// this api fetches the data required for the graphs on the summary page

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
async function GetGraphData() {
	const client = await getClient()
	const collection = client.db("main").collection("excel-data")
}

// handler for any calls to this endpoint
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const params = req.body

		const results = await GetGraphData()
		res.status(200).json(results)
	} catch (err) {
		console.error("Error at database/summary/getSummaryStats  :", err)
		res.status(500).json({ error: "Internal Server Error" })
	}
}
