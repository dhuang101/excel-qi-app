import { MongoClient } from "mongodb"
import { Permission } from "@/types/dbPermissionTypes"
import { NextApiRequest, NextApiResponse } from "next"

type ParamsType = {
	email: string
	loginDate: string
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

async function PostLoginDate(params: ParamsType) {
	const client = await getClient()
	const permissions = client.db("main").collection<Permission>("permissions")
	// ensure the date is in the correct timezone
	// no need for dayjs here, we can use native Date methods
	const loginDate = new Date(params.loginDate)
	await permissions.updateOne(
		{ email: params.email },
		{ $set: { loginDate: loginDate } },
		{ upsert: false }
	)
	return { message: "Login time saved successfully" }
}

// handler for any calls to this endpoint
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const params = req.body

	try {
		const results = await PostLoginDate(params)
		res.status(200).json(results)
	} catch (err) {
		console.error("Error at database/postLoginDate :", err)
		res.status(500).json({ error: "Internal Server Error" })
	}
}
