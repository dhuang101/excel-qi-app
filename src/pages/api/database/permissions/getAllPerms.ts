import { get } from "http"
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

async function GetAllPerms() {
	// connect to db
	const client = await getClient()
	const collection = client.db("main").collection("permissions")
	const results = await collection
		.find({}, { projection: { _id: 0 } }) // Omit the _id field
		.toArray()
	return results
}

// handler for any calls to this endpoint
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const results = await GetAllPerms()
		res.status(200).json(results)
	} catch (err) {
		console.error("Error at database/permissions/getAllPerms :", err)
		res.status(500).json({ error: "Internal Server Error" })
	}
}
