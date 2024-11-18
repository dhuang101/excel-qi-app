import { FindOptions, MongoClient } from "mongodb"

interface searchQuery {
	diagnosis_resp?: string
	diagnosis_cardiac?: string
	outcm_hosp_discharge_loc?: string
	hospadm_date_time_before?: string
	hospadm_date_time_after?: string
}

async function GetPatients(params: searchQuery) {
	// connect to db
	const client = new MongoClient(process.env.DB_CONNECTION_URI as string)
	const collection = client.db("main").collection("collection")
	// options for find
	let query = {}
	query = {
		...query,
		...(params.diagnosis_resp && {
			diagnosis_resp: { $regex: params.diagnosis_resp, $options: "i" },
		}),
		...(params.diagnosis_cardiac && {
			diagnosis_cardiac: {
				$regex: params.diagnosis_cardiac,
				$options: "i",
			},
		}),
		...(params.outcm_hosp_discharge_loc && {
			outcm_hosp_discharge_loc: {
				$regex: params.outcm_hosp_discharge_loc,
				$options: "i",
			},
		}),
		...((params.hospadm_date_time_before ||
			params.hospadm_date_time_after) && {
			hospadm_date_time: {
				...(params.hospadm_date_time_before && {
					$lte: new Date(params.hospadm_date_time_before),
				}),
				...(params.hospadm_date_time_after && {
					$gte: new Date(params.hospadm_date_time_after),
				}),
			},
		}),
	}
	const options = {
		// Include only the particular fields
		projection: { _id: 0 },
	} as FindOptions
	// run find
	const results = await collection.find(query, options).toArray()
	return results
}

// handler for any calls to this endpoint
export default async function handler(req: any, res: any) {
	const params = req.query

	try {
		const results = await GetPatients(params)
		res.status(200).json(results)
	} catch (err) {
		res.status(500).json(err)
	}
}
