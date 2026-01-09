import { MongoClient } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"

// this api fetches the summary statistics based on the attributes provided by the user

type ParamsType = {
	selectedYear: number
	ecmoMode: "total" | "VV" | "VA"
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
async function GetCaseStats(params: ParamsType) {
	const client = await getClient()
	const collection = client.db("main").collection("excel-data")

	const pipeline = [
		{
			$match: {
				$expr: {
					$eq: [
						{ $year: "$ecmo_start_date_time" },
						params.selectedYear,
					],
				},
			},
		},
		{
			$group: {
				_id: null,
				totalCount: { $sum: 1 },
				totalDeaths: {
					$sum: {
						$cond: [
							{ $eq: ["$outcm_hosp_discharge_loc", "Dead"] },
							1,
							0,
						],
					},
				},

				vaCount: {
					$sum: { $cond: [{ $eq: ["$ecmo_mode", "V-A"] }, 1, 0] },
				},
				vaDeaths: {
					$sum: {
						$cond: [
							{
								$and: [
									{ $eq: ["$ecmo_mode", "V-A"] },
									{
										$eq: [
											"$outcm_hosp_discharge_loc",
											"Dead",
										],
									},
								],
							},
							1,
							0,
						],
					},
				},

				vvCount: {
					$sum: { $cond: [{ $eq: ["$ecmo_mode", "V-V"] }, 1, 0] },
				},
				vvDeaths: {
					$sum: {
						$cond: [
							{
								$and: [
									{ $eq: ["$ecmo_mode", "V-V"] },
									{
										$eq: [
											"$outcm_hosp_discharge_loc",
											"Dead",
										],
									},
								],
							},
							1,
							0,
						],
					},
				},
			},
		},
		{
			$project: {
				_id: 0,
				total: {
					count: "$totalCount",
					mortalityRate: {
						$round: [
							{
								$cond: [
									{ $gt: ["$totalCount", 0] },
									{
										$multiply: [
											{
												$divide: [
													"$totalDeaths",
													"$totalCount",
												],
											},
											100,
										],
									},
									0,
								],
							},
							2,
						],
					},
				},
				va: {
					count: "$vaCount",
					mortalityRate: {
						$round: [
							{
								$cond: [
									{ $gt: ["$vaCount", 0] },
									{
										$multiply: [
											{
												$divide: [
													"$vaDeaths",
													"$vaCount",
												],
											},
											100,
										],
									},
									0,
								],
							},
							2,
						],
					},
				},
				vv: {
					count: "$vvCount",
					mortalityRate: {
						$round: [
							{
								$cond: [
									{ $gt: ["$vvCount", 0] },
									{
										$multiply: [
											{
												$divide: [
													"$vvDeaths",
													"$vvCount",
												],
											},
											100,
										],
									},
									0,
								],
							},
							2,
						],
					},
				},
			},
		},
	]

	const [results] = await collection.aggregate(pipeline).toArray()

	const finalData = {
		cards: results,
	}

	return finalData
}

// handler for any calls to this endpoint
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const params = req.body as ParamsType

		const results = await GetCaseStats(params)
		res.status(200).json(results)
	} catch (err) {
		console.error("Error at database/summary/getSummaryStats  :", err)
		res.status(500).json({ error: "Internal Server Error" })
	}
}
