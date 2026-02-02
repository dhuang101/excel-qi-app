import { MongoClient } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"

// this api fetches the case stats in the cards at the top of the summary statistics page

type ParamsType = {
	role: string
	sites: string[]
	selectedYear: number
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

async function GetCaseStats(params: ParamsType) {
	const client = await getClient()
	const collection = client.db("main").collection("excel-data")

	const isPowerUser = ["admin", "global_viewer"].includes(params.role)
	const siteMatch = isPowerUser
		? {}
		: { redcap_data_access_group: { $in: params.sites } }

	// Common year filter used by both queries
	const yearMatch = {
		$expr: {
			$eq: [{ $year: "$ecmo_start_date_time" }, params.selectedYear],
		},
	}

	// 1. Pipeline for individual sites (Restricted by siteMatch)
	const pipeline = [
		{ $match: { $and: [siteMatch, yearMatch] } },
		{
			$group: {
				_id: "$redcap_data_access_group",
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
				site: "$_id",
				_id: 0,
				stats: {
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
		},
	]

	const results = await collection.aggregate(pipeline).toArray()
	const finalData: Record<string, any> = {}

	// Initialize requested sites
	if (!isPowerUser) {
		params.sites.forEach((site) => {
			finalData[site] = null
		})
	}

	results.forEach((item) => {
		if (item.site) finalData[item.site] = item.stats
	})

	const [globalTotal] = await collection
		.aggregate([
			{ $match: yearMatch },
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
		])
		.toArray()

	finalData["all_sites"] = globalTotal || null

	return finalData
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const params = req.body as ParamsType
		const results = await GetCaseStats(params)
		res.status(200).json(results)
	} catch (err) {
		console.error("Error at database/summary/getSummaryStats :", err)
		res.status(500).json({ error: "Internal Server Error" })
	}
}
