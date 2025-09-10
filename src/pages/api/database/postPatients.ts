import { SearchQuery, UserEnteredQuery } from "@/types/searchTypes"
import { FindOptions, MongoClient } from "mongodb"

async function PostPatients(params: SearchQuery) {
	const client = new MongoClient(process.env.DB_CONNECTION_URI as string)
	const collection = client.db("main").collection("collection")

	// Build text-based filters
	let query: any = {
		...(params.userEnteredQuery.diagnosis_resp && {
			diagnosis_resp: {
				$regex: params.userEnteredQuery.diagnosis_resp,
				$options: "i",
				$ne: "N/A",
			},
		}),
		...(params.userEnteredQuery.diagnosis_cardiac && {
			diagnosis_cardiac: {
				$regex: params.userEnteredQuery.diagnosis_cardiac,
				$options: "i",
				$ne: "N/A",
			},
		}),
		...(params.userEnteredQuery.outcm_hosp_discharge_loc && {
			outcm_hosp_discharge_loc: {
				$regex: params.userEnteredQuery.outcm_hosp_discharge_loc,
				$options: "i",
				$ne: "N/A",
			},
		}),
	}

	// Remove undefined or null fields
	query = Object.fromEntries(
		Object.entries(query).filter(([_, value]) => value !== undefined)
	)

	// Add date-based filters
	const dateFields: [keyof UserEnteredQuery, string][] = [
		["hospadm_date_time_after", "hospadm_date_time"],
		["hospadm_date_time_before", "hospadm_date_time"],
		["icuadm_date_time_after", "icuadm_date_time"],
		["icuadm_date_time_before", "icuadm_date_time"],
		["ecmo_start_date_time_after", "ecmo_start_date_time"],
		["ecmo_start_date_time_before", "ecmo_start_date_time"],
		["decan_date_time_after", "decan_date_time"],
		["decan_date_time_before", "decan_date_time"],
		["outcm_icu_discharge_after", "outcm_icu_discharge"],
		["outcm_icu_discharge_before", "outcm_icu_discharge"],
		["outcm_hosp_discharge_after", "outcm_hosp_discharge"],
		["outcm_hosp_discharge_before", "outcm_hosp_discharge"],
	]

	const dateConditions: Record<string, any> = {}

	for (const [userField, mongoField] of dateFields) {
		const val = params.userEnteredQuery[userField]
		if (!val) continue

		if (!dateConditions[mongoField]) {
			dateConditions[mongoField] = {}
		}

		if (userField.endsWith("after")) {
			dateConditions[mongoField]["$gte"] = new Date(val)
		} else if (userField.endsWith("before")) {
			dateConditions[mongoField]["$lte"] = new Date(val)
		}
	}

	// Combine filters into final Mongo query
	query = {
		$and: [
			query,
			...Object.entries(dateConditions).map(([field, condition]) => ({
				[field]: condition,
			})),
			// Conditionally include site filtering if not admin/global_viewer
			...(params.role !== "admin" && params.role !== "global_viewer"
				? [
						{
							redcap_data_access_group: {
								$in: params.sites,
							},
						},
				  ]
				: []),
		],
	}

	const options: FindOptions = {
		projection: { _id: 0 }, // Exclude Mongo _id
	}

	const results = await collection.find(query, options).toArray()
	client.close()
	return results
}

// API Route Handler
export default async function handler(req: any, res: any) {
	const params = req.body as SearchQuery

	try {
		const results = await PostPatients(params)
		res.status(200).json(results)
	} catch (err) {
		console.error("Error at database/permissions/postPatients :", err)
		res.status(500).json({ error: "Internal Server Error" })
	}
}
