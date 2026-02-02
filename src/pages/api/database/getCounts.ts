import { MongoClient } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"

type ParamsType = {
	role: string
	sites: string[]
}

const ARDS_OUTCOMES_MAP: Record<string, string> = {
	rrt: "Renal replacement therapy",
	form11_mech_oxygenator: "Oxygenator failure",
	form11_mech_pump: "Pump failure",
	form11_mech_thromb: "Thrombosis/clots: circuit component",
	form11_haem_surgical: "Surgical site bleeding",
	form11_haem_major: "Major bleeding",
	form11_cardio_ami: "Acute myocardial infarction",
	form11_limb_ischemia: "Limb ischaemia requiring limb reperfusion cannula",
	form11_mech_problem: "Cannula problems",
	form11_haem_hemorrhage: "GI haemorrhage",
	form11_renal_265: "Creatinine >265μmol/L (>3.0)",
	form11_pulmonary_pule: "Pulmonary embolism",
	form11_pulmonary_pulh: "Pulmonary haemorrhage",
	form11_metabolic_heamm: "Moderate haemolysis",
	form11_limb_pressure: "Pressure injury",
	form11_neuro_bd: "Brain death",
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

// this api fetches each the count of unique value of each attribute in the attributes list
async function GetCounts(params: ParamsType) {
	const client = await getClient()
	const collection = client.db("main").collection("excel-data")

	// attributes for simple graphs
	const attributes = [
		"outcm_hosp_discharge_loc",
		"diagnosis_cardiac",
		"diagnosis_resp",
		"ecmo_mode",
		"ecmo_indication",
	]

	// attributes for ARDS Complications graph
	const ardsKeys = [
		"form11_mech_oxygenator",
		"form11_mech_pump",
		"form11_mech_thromb",
		"form11_haem_surgical",
		"form11_haem_major",
		"form11_cardio_ami",
		"form11_limb_ischemia",
		"form11_mech_problem",
		"form11_haem_hemorrhage",
		"form11_renal_265",
		"form11_pulmonary_pule",
		"form11_pulmonary_pulh",
		"form11_metabolic_heamm",
		"form11_limb_pressure",
		"form11_neuro_bd",
		"rrt",
	]

	const facetStages: Record<string, any[]> = {}

	// construct facet query to fetch all required data
	attributes.forEach((attr) => {
		facetStages[attr] = [
			{
				$match: {
					[attr]: { $nin: [null, "N/A"] },
					redcap_data_access_group: { $nin: [null, ""] },
				},
			},
			{
				$group: {
					_id: {
						site: "$redcap_data_access_group",
						value: `$${attr}`,
					},
					count: { $sum: 1 },
				},
			},
			{
				$project: {
					_id: 0,
					site: "$_id.site",
					count: 1,
					value:
						attr === "outcm_hosp_discharge_loc"
							? {
									$cond: [
										{ $eq: ["$_id.value", "Dead"] },
										"Deceased",
										"$_id.value",
									],
								}
							: "$_id.value",
				},
			},
		]
	})

	facetStages["ards_outcomes"] = [
		{ $match: { redcap_data_access_group: { $nin: [null, ""] } } },
		{
			$group: {
				_id: "$redcap_data_access_group",
				...ardsKeys.reduce(
					(acc, key) => ({
						...acc,
						[key]: {
							$sum: {
								$cond: [
									{ $in: [`$${key}`, [1, "1", "Yes", true]] },
									1,
									0,
								],
							},
						},
					}),
					{},
				),
			},
		},
	]

	facetStages["siteTotals"] = [
		{ $match: { redcap_data_access_group: { $nin: [null, ""] } } },
		{ $group: { _id: "$redcap_data_access_group", count: { $sum: 1 } } },
	]

	const [rawResults] = await collection
		.aggregate([{ $facet: facetStages }])
		.toArray()

	const siteResultsMap: Record<string, any> = {}
	const allSitesCounts: any = { ards_outcomes: {} }
	let globalTotal = 0

	// initialize map
	rawResults.siteTotals.forEach((s: any) => {
		siteResultsMap[s._id] = {
			totalDocuments: s.count,
			counts: { ards_outcomes: [] },
		}
		globalTotal += s.count
	})

	// fill attributes for simple graphs
	attributes.forEach((attr) => {
		allSitesCounts[attr] = {}
		rawResults[attr].forEach((item: any) => {
			const { site, value, count } = item
			if (siteResultsMap[site]) {
				if (!siteResultsMap[site].counts[attr])
					siteResultsMap[site].counts[attr] = []
				siteResultsMap[site].counts[attr].push({ value, count })
				allSitesCounts[attr][value] =
					(allSitesCounts[attr][value] || 0) + count
			}
		})
	})

	// fill attributes for ARDS Complications
	rawResults.ards_outcomes.forEach((siteData: any) => {
		const site = siteData._id
		if (siteResultsMap[site]) {
			ardsKeys.forEach((key) => {
				const count = siteData[key] || 0
				const displayName = ARDS_OUTCOMES_MAP[key]

				siteResultsMap[site].counts.ards_outcomes.push({
					value: displayName,
					count,
				})
				allSitesCounts.ards_outcomes[displayName] =
					(allSitesCounts.ards_outcomes[displayName] || 0) + count
			})
		}
	})

	const allSitesEntry = {
		site: "all_sites",
		totalDocuments: globalTotal,
		counts: {
			...Object.fromEntries(
				attributes.map((attr) => [
					attr,
					Object.entries(allSitesCounts[attr]).map(
						([value, count]) => ({ value, count: count as number }),
					),
				]),
			),
			ards_outcomes: Object.entries(allSitesCounts.ards_outcomes).map(
				([label, count]) => ({
					value: label,
					count: count as number,
				}),
			),
		},
	}

	if (params.role === "public") return [allSitesEntry]

	const filteredSites = Object.entries(siteResultsMap)
		.map(([site, data]) => ({ site, ...data }))
		.filter((r) => {
			if (["global-viewer", "admin"].includes(params.role)) return true
			return (
				params.role === "site-viewer" && params.sites.includes(r.site)
			)
		})

	return [allSitesEntry, ...filteredSites]
}

// handler for any calls to this endpoint
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const params = req.body as ParamsType

	try {
		const results = await GetCounts(params)
		res.status(200).json(results)
	} catch (err) {
		console.error("Error at database/getCounts :", err)
		res.status(500).json({ error: "Internal Server Error" })
	}
}
