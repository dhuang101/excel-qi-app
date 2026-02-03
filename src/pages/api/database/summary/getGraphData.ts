import { MongoClient } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"

// this api fetches the data required for the graphs on the summary page

type ParamsType = {
	role: string
	sites: string[]
	selectedYear: number
	selectedMonth: number
	ecmoMode: "total" | "V-V" | "V-A"
	// | "V-VA" | "A-VCO2R" | "V-VECCO2R" | "VP"
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

async function GetGraphData(params: ParamsType) {
	const client = await getClient()
	const collection = client.db("main").collection("excel-data")

	const isPowerUser = ["admin", "global_viewer"].includes(params.role)

	// Logic for dynamic date range
	let startDate: Date
	let endDate: Date

	if (params.selectedMonth > 0) {
		startDate = new Date(
			Date.UTC(params.selectedYear, params.selectedMonth - 1, 1, 0, 0, 0),
		)
		endDate = new Date(
			Date.UTC(
				params.selectedYear,
				params.selectedMonth,
				0,
				23,
				59,
				59,
				999,
			),
		)
	} else {
		startDate = new Date(Date.UTC(params.selectedYear, 0, 1, 0, 0, 0))
		endDate = new Date(
			Date.UTC(params.selectedYear, 11, 31, 23, 59, 59, 999),
		)
	}

	const baseFilters: Record<string, any> = {
		ecmo_start_date_time: {
			$gte: startDate,
			$lte: endDate,
		},
	}

	if (params.ecmoMode !== "total") {
		baseFilters.ecmo_mode = params.ecmoMode
	}

	const rawData = await collection
		.aggregate([
			{ $match: baseFilters },
			{
				$group: {
					_id: {
						site: "$redcap_data_access_group",
						ageStr: "$birthdate",
						sex: "$sex",
					},
					count: { $sum: 1 },
					deaths: {
						$sum: {
							$cond: [
								{ $eq: ["$outcm_hosp_discharge_loc", "Dead"] },
								1,
								0,
							],
						},
					},
				},
			},
		])
		.toArray()

	const processDistributions = (dataPoints: any[]) => {
		const ranges = [
			{ label: "18-29", min: 18, max: 29 },
			{ label: "30-39", min: 30, max: 39 },
			{ label: "40-49", min: 40, max: 49 },
			{ label: "50-54", min: 50, max: 54 },
			{ label: "55-59", min: 55, max: 59 },
			{ label: "60-64", min: 60, max: 64 },
			{ label: "65-74", min: 65, max: 74 },
			{ label: "75-79", min: 75, max: 79 },
			{ label: "80+", min: 80, max: 999 },
		]

		const totalOverall = dataPoints.reduce((sum, d) => sum + d.count, 0)

		const ageResults = ranges.map((range) => {
			const matches = dataPoints.filter((d) => {
				const age = parseInt(d.ageStr)
				return age >= range.min && age <= range.max
			})
			const count = matches.reduce((sum, m) => sum + m.count, 0)
			const deaths = matches.reduce((sum, m) => sum + m.deaths, 0)

			return {
				ageRange: range.label,
				totalCount: count,
				totalDeaths: deaths,
				mortalityDist:
					count > 0
						? Math.round((deaths / count) * 100 * 100) / 100
						: 0,
				caseDistribution:
					totalOverall > 0
						? Math.round((count / totalOverall) * 100 * 100) / 100
						: 0,
			}
		})

		const genderMap: Record<string, { count: number; deaths: number }> = {
			Male: { count: 0, deaths: 0 },
			Female: { count: 0, deaths: 0 },
		}

		dataPoints.forEach((d) => {
			const label =
				d.sex === 1 ? "Male" : d.sex === 2 ? "Female" : "Unknown"
			genderMap[label].count += d.count
			genderMap[label].deaths += d.deaths
		})

		const genderDist = Object.entries(genderMap).map(([gender, stats]) => ({
			gender,
			percentOfTotal:
				totalOverall > 0
					? Math.round((stats.count / totalOverall) * 100 * 100) / 100
					: 0,
			mortalityRate:
				stats.count > 0
					? Math.round((stats.deaths / stats.count) * 100 * 100) / 100
					: 0,
		}))

		return {
			mortalityDist: ageResults.map((r) => ({
				ageRange: r.ageRange,
				value: r.mortalityDist,
			})),
			caseDist: ageResults.map((r) => ({
				ageRange: r.ageRange,
				value: r.caseDistribution,
			})),
			caseDeathDist: ageResults.map((r) => ({
				ageRange: r.ageRange,
				totalCases: r.totalCount,
				totalDeaths: r.totalDeaths,
			})),
			genderDist,
		}
	}

	const response: Record<string, any> = {}

	response["all_sites"] = processDistributions(
		rawData.map((d) => ({
			ageStr: d._id.ageStr,
			sex: d._id.sex,
			count: d.count,
			deaths: d.deaths,
		})),
	)

	const allowedSites = isPowerUser
		? Array.from(new Set(rawData.map((d) => d._id.site)))
		: params.sites

	allowedSites.forEach((site) => {
		const siteData = rawData
			.filter((d) => d._id.site === site)
			.map((d) => ({
				ageStr: d._id.ageStr,
				sex: d._id.sex,
				count: d.count,
				deaths: d.deaths,
			}))
		response[site as string] =
			siteData.length > 0 ? processDistributions(siteData) : null
	})

	return response
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const params = req.body as ParamsType
		const results = await GetGraphData(params)
		res.status(200).json(results)
	} catch (err) {
		console.error("Error at database/summary/getGraphData :", err)
		res.status(500).json({ error: "Internal Server Error" })
	}
}
