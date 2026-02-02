import { MongoClient } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"

// this api fetches the data required for the graphs on the summary page

type ParamsType = {
	role: string
	sites: string[]
	selectedYear: number
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
	const siteMatch = isPowerUser
		? {}
		: { redcap_data_access_group: { $in: params.sites } }

	const matchStage: Record<string, any> = {
		...siteMatch,
		ecmo_start_date_time: {
			$gte: new Date(`${params.selectedYear}-01-01T00:00:00.000Z`),
			$lte: new Date(`${params.selectedYear}-12-31T23:59:59.999Z`),
		},
	}

	if (params.ecmoMode !== "total") {
		matchStage.ecmo_mode = params.ecmoMode
	}

	const rawData = await collection
		.aggregate([
			{ $match: matchStage },
			{
				$group: {
					_id: {
						site: "$redcap_data_access_group",
						ageStr: "$birthdate",
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

	const bucketData = (dataPoints: any[]) => {
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

		const totalCases = dataPoints.reduce((sum, d) => sum + d.count, 0)

		const results = ranges.map((range) => {
			const matches = dataPoints.filter((d) => {
				const age = parseInt(d.ageStr)
				return age >= range.min && age <= range.max
			})

			const count = matches.reduce((sum, m) => sum + m.count, 0)
			const deaths = matches.reduce((sum, m) => sum + m.deaths, 0)

			return {
				ageRange: range.label,
				totalCount: count,
				deadCount: deaths,
				mortalityDist:
					count > 0
						? Math.round((deaths / count) * 100 * 100) / 100
						: 0,
				caseDistribution:
					totalCases > 0
						? Math.round((count / totalCases) * 100 * 100) / 100
						: 0,
			}
		})

		return {
			mortalityDist: results.map((r) => ({
				ageRange: r.ageRange,
				value: r.mortalityDist,
			})),
			caseDist: results.map((r) => ({
				ageRange: r.ageRange,
				value: r.caseDistribution,
			})),
			caseDeathDist: results.map((r) => ({
				ageRange: r.ageRange,
				totalCases: r.totalCount,
				totalDeaths: r.deadCount,
			})),
			genderDist: [], // Placeholder for your gender logic
		}
	}

	const response: Record<string, any> = {}

	response["all_sites"] = bucketData(
		rawData.map((d) => ({
			ageStr: d._id.ageStr,
			count: d.count,
			deaths: d.deaths,
		})),
	)

	const uniqueSites = isPowerUser
		? Array.from(new Set(rawData.map((d) => d._id.site)))
		: params.sites

	uniqueSites.forEach((site) => {
		const siteData = rawData
			.filter((d) => d._id.site === site)
			.map((d) => ({
				ageStr: d._id.ageStr,
				count: d.count,
				deaths: d.deaths,
			}))

		response[site as string] =
			siteData.length > 0 ? bucketData(siteData) : null
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
