import { MongoClient } from "mongodb"
import qs from "qs"

interface ValueCount {
	_id: string
	count: number
}

type paramsType = {
	role: string
	sites: string[]
}

// this api fetches each each the count of unique value of each attribute in the attributes list

async function GetCounts(params: paramsType) {
	// connect to db
	const client = new MongoClient(process.env.DB_CONNECTION_URI as string)
	const collection = client.db("main").collection("collection")
	const attributes = [
		"outcm_hosp_discharge_loc",
		"diagnosis_cardiac",
		"diagnosis_resp",
	]

	// first, get the total number of documents in the collection
	const totalDocuments = await collection.countDocuments()
	// explicitly type the results object
	const results: {
		totalDocuments: number
		counts: Record<string, { _id: string; count: number }[]>
	} = {
		totalDocuments,
		counts: {},
	}

	// create query for db fetch
	for (const attribute of attributes) {
		const matchStage: any = {
			[attribute]: {
				$nin: [null, "N/A"],
			},
		}

		if (params.role === "site-viewer") {
			matchStage.redcap_data_access_group = { $in: params.sites }
		} else if (!["global-viewer", "admin"].includes(params.role)) {
			throw new Error("Invalid role")
		}

		const pipeline: any[] = [
			{ $match: matchStage },
			{ $group: { _id: `$${attribute}`, count: { $sum: 1 } } },
			{ $sort: { count: -1 } },
		]

		// replaces Dead with Deceased for the outcome
		if (attribute === "outcm_hosp_discharge_loc") {
			pipeline.splice(2, 0, {
				$addFields: {
					_id: {
						$cond: {
							if: { $eq: ["$_id", "Dead"] },
							then: "Deceased",
							else: "$_id",
						},
					},
				},
			})
		}

		const values = await collection
			.aggregate<ValueCount>(pipeline)
			.toArray()

		results.counts[attribute] = values
	}

	return results
}

// handler for any calls to this endpoint
export default async function handler(req: any, res: any) {
	const params = qs.parse(req.query) as paramsType

	try {
		const results = await GetCounts(params)
		res.status(200).json(results)
	} catch (err) {
		res.status(500).json(err)
	}
}
