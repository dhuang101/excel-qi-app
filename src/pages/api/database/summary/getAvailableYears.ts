import { MongoClient } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"

// this api will update any users attributes in the permissions collection effectively
// adjusting their access to the application

type ParamsType = {
	role: string
	sites: string[]
}

type YearsResponse = Record<string, number[]>

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
async function GetAvailableYears(params: ParamsType): Promise<YearsResponse> {
	const client = await getClient()
	const collection = client.db("main").collection("excel-data")

	const isPowerUser = ["admin", "global_viewer"].includes(params.role)
	const matchQuery = isPowerUser
		? {}
		: { redcap_data_access_group: { $in: params.sites } }

	const [facetResult] = await collection
		.aggregate([
			{ $match: matchQuery },
			{
				$facet: {
					// Pipeline 1: Get years per site
					bySite: [
						{
							$group: {
								_id: {
									site: "$redcap_data_access_group",
									year: { $year: "$ecmo_start_date_time" },
								},
							},
						},
						{
							$group: {
								_id: "$_id.site",
								years: { $push: "$_id.year" },
							},
						},
					],
					// Pipeline 2: Get unique years for ALL sites
					allSites: [
						{
							$group: {
								_id: { $year: "$ecmo_start_date_time" },
							},
						},
						{
							$group: {
								_id: null,
								years: { $push: "$_id" },
							},
						},
					],
				},
			},
		])
		.toArray()

	const formattedResponse: YearsResponse = {}

	// 1. Handle "all_sites" (Master list)
	const allYearsRaw = facetResult.allSites[0]?.years || []
	formattedResponse["all_sites"] = allYearsRaw
		.filter((y: any) => y !== null)
		.sort((a: number, b: number) => a - b)

	// 2. Initialize requested sites for standard users (to ensure keys exist)
	if (!isPowerUser) {
		params.sites.forEach((site) => {
			formattedResponse[site] = []
		})
	}

	// 3. Fill in the data from the bySite facet
	facetResult.bySite.forEach((item: any) => {
		if (item._id) {
			formattedResponse[item._id] = item.years
				.filter((y: any) => y !== null)
				.sort((a: number, b: number) => a - b)
		}
	})

	return formattedResponse
}
// handler for any calls to this endpoint
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const params = req.body as ParamsType
		const results = await GetAvailableYears(params)
		res.status(200).json(results)
	} catch (err) {
		console.error("Error at database/summary/getAvailableYears :", err)
		res.status(500).json({ error: "Internal Server Error" })
	}
}
