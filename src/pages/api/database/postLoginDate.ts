import { MongoClient } from "mongodb"
import { Permission } from "@/types/dbPermissionTypes"

type ParamsType = {
	email: string
	loginDate: string
}

async function postLoginDate(params: ParamsType) {
	const client = new MongoClient(process.env.DB_CONNECTION_URI as string)
	const permissions = client.db("main").collection<Permission>("permissions")
	// Ensure loginTime is a Date object
	const loginDate = new Date(params.loginDate)
	await permissions.updateOne(
		{ email: params.email },
		{ $set: { loginDate: loginDate } },
		{ upsert: false }
	)
	await client.close()
	return { message: "Login time saved successfully" }
}

// handler for any calls to this endpoint
export default async function handler(req: any, res: any) {
	const params = req.body

	try {
		const results = await postLoginDate(params)
		res.status(200).json(results)
	} catch (err) {
		res.status(500).json(err)
	}
}
