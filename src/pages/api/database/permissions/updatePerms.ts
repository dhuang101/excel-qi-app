import { MongoClient } from "mongodb"

// this api will update any users attributes in the permissions collection effectively
// adjusting their access to the application

async function UpdatePerms() {
	// connect to db
	const client = new MongoClient(process.env.DB_CONNECTION_URI as string)
	const permissions = client.db("main").collection("permissions")
}

// handler for any calls to this endpoint
export default async function handler(req: any, res: any) {
	try {
		const results = await UpdatePerms()
		res.status(200).json(results)
	} catch (err) {
		res.status(500).json(err)
	}
}
