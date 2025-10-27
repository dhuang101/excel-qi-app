import { MongoClient } from "mongodb"

interface DocumentType {
	[key: string]: any // Allow dynamic indexing with string keys
}

type ParamsType = {
	role: string
	sites: string[]
}

type SummaryStats = {
	name: string
	count: number
	min: number
	q1: number
	median: number
	q3: number
	max: number
}

// Computes summary statistics for a given set of values
function computeSummaryStats(values: number[], name: string): SummaryStats {
	if (values.length === 0) {
		return {
			name,
			count: 0,
			min: NaN,
			q1: NaN,
			median: NaN,
			q3: NaN,
			max: NaN,
		}
	}
	const sorted = [...values].sort((a, b) => a - b)
	const count = sorted.length
	const min = sorted[0]
	const max = sorted[count - 1]
	const q1 = quantile(sorted, 0.25)
	const median = quantile(sorted, 0.5)
	const q3 = quantile(sorted, 0.75)
	return { name, count, min, q1, median, q3, max }
}

function quantile(sortedArr: number[], q: number): number {
	const pos = (sortedArr.length - 1) * q
	const base = Math.floor(pos)
	const rest = pos - base
	if (sortedArr[base + 1] !== undefined) {
		return sortedArr[base] + rest * (sortedArr[base + 1] - sortedArr[base])
	} else {
		return sortedArr[base]
	}
}

// this api fetches the length of stay values for each site
async function GetLosValues(params: ParamsType) {
	const client = new MongoClient(process.env.DB_CONNECTION_URI as string)
	const collection = client.db("main").collection<DocumentType>("excel-data")
	const attributes = [
		"outcm_ecmo_days_2",
		"outcm_icu_days",
		"outcm_hosp_days",
	]

	const projection = attributes.reduce(
		(proj: DocumentType, attr) => {
			proj[attr] = 1
			return proj
		},
		{ _id: 0, redcap_data_access_group: 1 }
	)

	const results = await collection.find({}, { projection }).toArray()

	let sites: string[] = params.sites
	if (
		(!sites || sites.length === 0) &&
		(params.role === "admin" || params.role === "global-viewer")
	) {
		sites = await collection.distinct("redcap_data_access_group")
	}
	client.close()

	const siteStats: Record<string, SummaryStats[]> = {}

	// Compute stats for each site
	if (params.role !== "public") {
		for (const site of sites) {
			const siteResults = results.filter(
				(doc) => doc.redcap_data_access_group === site
			)
			siteStats[site] = attributes.map((attr) => {
				const values = siteResults
					.map((doc) => doc[attr])
					.filter(
						(i) => typeof i === "number" && !isNaN(i)
					) as number[]
				return computeSummaryStats(values, attr)
			})
		}
	}

	// Compute stats for all sites combined
	siteStats["all_sites"] = attributes.map((attr) => {
		const values = results
			.map((doc) => doc[attr])
			.filter((i) => typeof i === "number" && !isNaN(i)) as number[]
		return computeSummaryStats(values, attr)
	})

	// Convert to array form
	const siteStatsArray = Object.entries(siteStats).map(([site, stats]) => ({
		site,
		stats,
	}))

	// If role is public, return only all_sites
	if (params.role === "public") {
		return siteStatsArray.filter((entry) => entry.site === "all_sites")
	}

	return siteStatsArray
}

// handler for any calls to this endpoint
export default async function handler(req: any, res: any) {
	const params = req.body as ParamsType

	try {
		const results = await GetLosValues(params)
		res.status(200).json(results)
	} catch (err) {
		console.error("Error at database/permissions/getLosValues :", err)
		res.status(500).json({ error: "Internal Server Error" })
	}
}
