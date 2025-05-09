import { error } from "console"
import { MongoClient } from "mongodb"

// this api will update any users attributes in the permissions collection effectively
// adjusting their access to the application

type paramsType = {
	email: string
	sites: string[]
}

const VALID_SITES = [
	"alfred_hospital",
	"auckland_city_hospital",
	"box_hill_hospital",
	"john_hunter_hospital",
	"prince_charles_hospital",
	"royal_adelaide_hospital",
	"royal_north_shore_hospital",
	"royal_prince_alfred_hospital",
	"st_vincents_sydney",
	"townsville_hospital",
]

async function UpdatePerms({ email, sites }: paramsType) {
	// connect to db
	const client = new MongoClient(process.env.DB_CONNECTION_URI as string)
	const permissions = client.db("main").collection("permissions")

	// validate input
	if (!sites.every((site) => VALID_SITES.includes(site))) {
		throw new Error("Invalid sites in parameters")
	}

	const result = await permissions.updateOne(
		{ email: email },
		{ $addToSet: { sites: { $each: sites } } }
	)

	client.close()
	return result
}

// handler for any calls to this endpoint
export default async function handler(req: any, res: any) {
	const params = req.body

	try {
		const results = await UpdatePerms(params)
		res.status(200).json(results)
	} catch (err) {
		res.status(500).json(err)
	}
}
