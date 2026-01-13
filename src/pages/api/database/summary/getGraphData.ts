import { MongoClient } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"

// this api fetches the data required for the graphs on the summary page

type ParamsType = {
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

// this api fetches all the unique years in the column ecmo_start_date_time for the summary statistics page
async function GetGraphData(params: ParamsType) {
	const client = await getClient()
	const collection = client.db("main").collection("excel-data")

	const matchStage: Record<string, any> = {
		ecmo_start_date_time: {
			$gte: new Date(`${params.selectedYear}-01-01T00:00:00.000Z`),
			$lte: new Date(`${params.selectedYear}-12-31T23:59:59.999Z`),
		},
	}

	if (params.ecmoMode !== "total") {
		matchStage.ecmo_mode = params.ecmoMode
	}

	const pipeline = [
		{ $match: matchStage },
		{
			$project: {
				age: "$birthdate",
				isDead: {
					$cond: [
						{ $eq: ["$outcm_hosp_discharge_loc", "Dead"] },
						1,
						0,
					],
				},
			},
		},
		{
			$bucket: {
				groupBy: "$age",
				boundaries: [0, 18, 30, 40, 50, 55, 60, 65, 75, 80],
				default: 80,
				output: {
					totalCount: { $sum: 1 },
					deadCount: { $sum: "$isDead" },
				},
			},
		},
		{
			$setWindowFields: {
				output: {
					grandTotalCases: { $sum: "$totalCount" },
				},
			},
		},
		{
			$project: {
				_id: 0,
				ageRange: {
					$switch: {
						branches: [
							{ case: { $eq: ["$_id", 0] }, then: "0-17" },
							{ case: { $eq: ["$_id", 18] }, then: "18-29" },
							{ case: { $eq: ["$_id", 30] }, then: "30-39" },
							{ case: { $eq: ["$_id", 40] }, then: "40-49" },
							{ case: { $eq: ["$_id", 50] }, then: "50-54" },
							{ case: { $eq: ["$_id", 55] }, then: "55-59" },
							{ case: { $eq: ["$_id", 60] }, then: "60-64" },
							{ case: { $eq: ["$_id", 65] }, then: "65-74" },
							{ case: { $eq: ["$_id", 75] }, then: "75-79" },
							{ case: { $eq: ["$_id", 80] }, then: "80+" },
						],
						default: "Unknown",
					},
				},
				mortalityDist: {
					$cond: [
						{ $eq: ["$totalCount", 0] },
						0,
						{
							$round: [
								{
									$multiply: [
										{
											$divide: [
												"$deadCount",
												"$totalCount",
											],
										},
										100,
									],
								},
								2,
							],
						},
					],
				},
				caseDistribution: {
					$cond: [
						{ $eq: ["$grandTotalCases", 0] },
						0,
						{
							$round: [
								{
									$multiply: [
										{
											$divide: [
												"$totalCount",
												"$grandTotalCases",
											],
										},
										100,
									],
								},
								2,
							],
						},
					],
				},
				// Pass raw counts through for the third key
				totalCount: "$totalCount",
				deadCount: "$deadCount",
			},
		},
		{ $sort: { ageRange: 1 } },
	]

	const results = await collection.aggregate(pipeline).toArray()

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
	}
}

// handler for any calls to this endpoint
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const params = req.body

		const results = await GetGraphData(params)
		res.status(200).json(results)
	} catch (err) {
		console.error("Error at database/summary/getSummaryStats  :", err)
		res.status(500).json({ error: "Internal Server Error" })
	}
}
