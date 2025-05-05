import { MongoClient } from "mongodb"
import qs from "qs"

interface DocumentType {
	[key: string]: any // Allow dynamic indexing with string keys
}

type paramsType = {
	role: string
	sites: string[]
}

// this api simply fetches the values of attributes in the attributes list and orders them

async function GetLosValues(params: paramsType) {
	// connect to db
	const client = new MongoClient(process.env.DB_CONNECTION_URI as string)
	const collection = client.db("main").collection<DocumentType>("collection")
	const attributes = [
		"outcm_ecmo_days_2",
		"outcm_icu_days",
		"outcm_hosp_days",
	]

	// Build the projection dynamically
	const projection = attributes.reduce(
		(proj: DocumentType, attr) => {
			proj[attr] = 1 // Include the attribute in the projection
			return proj
		},
		{ _id: 0 }
	) // Exclude _id

	// Build the query dynamically
	const query: DocumentType = {}

	// Add redcap_data_access_group conditionally
	if (params.role === "site-viewer" && params.sites.length > 0) {
		query.redcap_data_access_group = { $in: params.sites }
	}

	// Fetch all relevant fields with query + projection
	const results = await collection.find(query, { projection }).toArray()

	// Transform results into the desired format
	const valuesAsObjects = results.flatMap(
		(doc) =>
			attributes
				.filter((attr) => doc[attr] !== undefined) // Exclude undefined attributes
				.map((attr) => ({ name: attr, value: doc[attr] })) // Create the desired objects
	)

	return valuesAsObjects
}

// handler for any calls to this endpoint
export default async function handler(req: any, res: any) {
	const params = qs.parse(req.query) as paramsType

	try {
		const results = await GetLosValues(params)
		res.status(200).json(results)
	} catch (err) {
		res.status(500).json(err)
	}
}
