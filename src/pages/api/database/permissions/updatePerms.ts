import { Permission } from "@/types/dbPermissionTypes"
import { MongoClient } from "mongodb"

// this api will update any users attributes in the permissions collection effectively
// adjusting their access to the application

interface ParamsType {
	email: string
	addSites: string[]
	removeSites: string[]
	changedRole: string
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

async function UpdatePerms({
	email,
	addSites,
	removeSites,
	changedRole,
}: ParamsType) {
	// connect to db
	const client = new MongoClient(process.env.DB_CONNECTION_URI as string)
	const permissions = client.db("main").collection<Permission>("permissions")

	// validate input
	if (
		!addSites.every((site) => VALID_SITES.includes(site)) &&
		!removeSites.every((site) => VALID_SITES.includes(site))
	) {
		throw new Error("Invalid sites in parameters")
	}

	const updateDoc: any = {}

	if (addSites.length > 0) {
		updateDoc.$addToSet = { redcap_data_access_group: { $each: addSites } }
	}

	if (removeSites.length > 0) {
		updateDoc.$pull = { redcap_data_access_group: { $in: removeSites } }
	}

	if (changedRole && changedRole.trim() !== "") {
		updateDoc.$set = { role: changedRole }
	}

	// apply update
	await permissions.updateOne({ email }, updateDoc)

	await client.close()
	return { message: "Permissions updated successfully." }
}

// handler for any calls to this endpoint
export default async function handler(req: any, res: any) {
	const params = req.body

	try {
		const results = await UpdatePerms(params)
		res.status(200).json(results)
	} catch (err) {
		console.error("Error at database/permissions/updatePerms :", err)
		res.status(500).json({ error: "Internal Server Error" })
	}
}
