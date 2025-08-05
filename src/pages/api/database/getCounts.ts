import { MongoClient } from "mongodb"
import qs from "qs"

interface ValueCount {
	_id: string
	count: number
}

type ParamsType = {
	role: string
	sites: string[]
}

// this api fetches each each the count of unique value of each attribute in the attributes list
async function GetCounts(params: ParamsType) {
	const client = new MongoClient(process.env.DB_CONNECTION_URI as string)
	const collection = client.db("main").collection("collection")
	const attributes = [
		"outcm_hosp_discharge_loc",
		"diagnosis_cardiac",
		"diagnosis_resp",
	]

	// Initialize objects to hold results
	const siteResultsMap: Record<
		string,
		{
			totalDocuments: number
			counts: Record<string, ValueCount[]>
		}
	> = {}

	const allSitesCounts: {
		totalDocuments: number
		counts: Record<string, Record<string, number>>
	} = {
		totalDocuments: 0,
		counts: {},
	}

	// Aggregate attribute counts grouped by site and attribute value
	for (const attribute of attributes) {
		const matchStage = {
			[attribute]: { $nin: [null, "N/A"] },
			redcap_data_access_group: { $nin: [null, ""] },
		}

		const groupStage = {
			_id: {
				site: "$redcap_data_access_group",
				value: `$${attribute}`,
			},
			count: { $sum: 1 },
		}

		const projectStage = {
			$project: {
				site: "$_id.site",
				_id: "$_id.value",
				count: 1,
			},
		}

		const pipeline: any[] = [
			{ $match: matchStage },
			{ $group: groupStage },
			projectStage,
			{ $sort: { count: -1 } },
		]

		if (attribute === "outcm_hosp_discharge_loc") {
			pipeline.splice(3, 0, {
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

		const rawValues = await collection.aggregate(pipeline).toArray()

		for (const { site, _id, count } of rawValues) {
			if (!siteResultsMap[site]) {
				siteResultsMap[site] = {
					totalDocuments: 0,
					counts: {},
				}
			}
			if (!siteResultsMap[site].counts[attribute]) {
				siteResultsMap[site].counts[attribute] = []
			}
			siteResultsMap[site].counts[attribute].push({ _id, count })

			if (!allSitesCounts.counts[attribute]) {
				allSitesCounts.counts[attribute] = {}
			}
			allSitesCounts.counts[attribute][_id] =
				(allSitesCounts.counts[attribute][_id] || 0) + count
		}
	}

	// Calculate total documents per site
	const siteDocCounts = await collection
		.aggregate([
			{
				$match: {
					redcap_data_access_group: { $nin: [null, ""] },
				},
			},
			{
				$group: {
					_id: "$redcap_data_access_group",
					count: { $sum: 1 },
				},
			},
		])
		.toArray()

	for (const { _id: site, count } of siteDocCounts) {
		if (siteResultsMap[site]) {
			siteResultsMap[site].totalDocuments = count
		}
	}

	allSitesCounts.totalDocuments = siteDocCounts.reduce(
		(sum, s) => sum + s.count,
		0
	)

	client.close()

	const siteResultsArray = Object.entries(siteResultsMap).map(
		([site, data]) => ({
			site,
			...data,
		})
	)

	// Build the all_sites entry
	const allSitesEntry = {
		site: "all_sites",
		totalDocuments: allSitesCounts.totalDocuments,
		counts: Object.fromEntries(
			Object.entries(allSitesCounts.counts).map(
				([attribute, valueCounts]) => [
					attribute,
					Object.entries(valueCounts).map(([value, count]) => ({
						_id: value,
						count,
					})),
				]
			)
		),
	}

	// Filter results based on user role and sites
	let filteredSites = siteResultsArray
	if (params.role === "site-viewer" && params.sites.length > 0) {
		filteredSites = siteResultsArray.filter((r) =>
			params.sites.includes(r.site)
		)
	} else if (!["global-viewer", "admin"].includes(params.role)) {
		throw new Error("Server Error: in GetCounts - Unauthorized role")
	}

	return [allSitesEntry, ...filteredSites]
}

// handler for any calls to this endpoint
export default async function handler(req: any, res: any) {
	const params = qs.parse(req.query) as ParamsType

	try {
		const results = await GetCounts(params)
		res.status(200).json(results)
	} catch (err) {
		res.status(500).json(err)
	}
}
