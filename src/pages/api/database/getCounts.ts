import { MongoClient } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"

interface ValueCount {
	value: string
	count: number
}

type ParamsType = {
	role: string
	sites: string[]
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

	const attributes = [
		"outcm_hosp_discharge_loc",
		"diagnosis_cardiac",
		"diagnosis_resp",
		"ecmo_mode",
		"ecmo_indication",
	]

	const facetStages: Record<string, any[]> = {}

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
			{ $sort: { count: -1 } },
		]
	})

	facetStages["siteTotals"] = [
		{ $match: { redcap_data_access_group: { $nin: [null, ""] } } },
		{ $group: { _id: "$redcap_data_access_group", count: { $sum: 1 } } },
	]

	const [rawResults] = await collection
		.aggregate([{ $facet: facetStages }])
		.toArray()

	const siteResultsMap: Record<
		string,
		{ totalDocuments: number; counts: Record<string, ValueCount[]> }
	> = {}
	const allSitesCounts: Record<string, Record<string, number>> = {}
	let globalTotal = 0

	rawResults.siteTotals.forEach((s: any) => {
		siteResultsMap[s._id] = { totalDocuments: s.count, counts: {} }
		globalTotal += s.count
	})

	attributes.forEach((attr) => {
		allSitesCounts[attr] = {}
		rawResults[attr].forEach((item: any) => {
			const { site, value, count } = item

			if (siteResultsMap[site]) {
				if (!siteResultsMap[site].counts[attr])
					siteResultsMap[site].counts[attr] = []
				siteResultsMap[site].counts[attr].push({ value, count })
			}

			allSitesCounts[attr][value] =
				(allSitesCounts[attr][value] || 0) + count
		})
	})

	const allSitesEntry = {
		site: "all_sites",
		totalDocuments: globalTotal,
		counts: Object.fromEntries(
			Object.entries(allSitesCounts).map(([attr, values]) => [
				attr,
				Object.entries(values).map(([value, count]) => ({
					value,
					count: count as number,
				})),
			])
		),
	}

	if (params.role === "public") return [allSitesEntry]

	const filteredSites = Object.entries(siteResultsMap)
		.map(([site, data]) => ({ site, ...data }))
		.filter((r) => {
			if (["global-viewer", "admin"].includes(params.role)) return true
			if (params.role === "site-viewer")
				return params.sites.includes(r.site)
			return false
		})

	if (
		params.role === "site-viewer" &&
		filteredSites.length === 0 &&
		params.sites.length > 0
	) {
		throw new Error("Unauthorized role or site access")
	}

	return [allSitesEntry, ...filteredSites]
}

// handler for any calls to this endpoint
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
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
