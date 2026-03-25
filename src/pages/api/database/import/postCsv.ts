import { MongoClient } from "mongodb"
import { excelImportRow } from "@/types/excelImportTypes"
import { NextApiRequest, NextApiResponse } from "next"

// this api takes the translated and merged rows from the CSV import
// and inserts them into the database

const dateFields = [
	"hospadm_date_time",
	"icuadm_date_time",
	"ecmo_start_date_time",
	"decan_date_time",
	"outcm_icu_discharge",
	"outcm_hosp_discharge",
]

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

// Helper to convert string numbers to numbers, except for date fields
function preProcessRow(row: excelImportRow): excelImportRow {
	const returnVal: Record<string, any> = { ...row }
	for (const key in returnVal) {
		const value = returnVal[key]
		if (
			!dateFields.includes(key) &&
			typeof value === "string" &&
			!isNaN(Number(value)) &&
			value.trim() !== ""
		) {
			returnVal[key] = Number(value)
		} else if (dateFields.includes(key) && value) {
			const splitDate = returnVal[key].split("T")[0].split("-")
			returnVal[key] = new Date(
				Date.UTC(
					parseInt(splitDate[0]),
					parseInt(splitDate[1]) - 1,
					parseInt(splitDate[2])
				)
			)
		}
	}
	return returnVal as excelImportRow
}

async function PostCsv(params: excelImportRow[]) {
	const client = await getClient()
	const collection = client
		.db("main")
		.collection<excelImportRow>("excel-data")
	const processedRows: excelImportRow[] = params.map(preProcessRow)
	const operations = processedRows.map((row) => ({
		updateOne: {
			filter: { record_id: row.record_id },
			update: { $set: row },
			upsert: true,
		},
	}))
	await collection.bulkWrite(operations)
	return "Import Successful!"
}

// handler for any calls to this endpoint
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const params = req.body.records

	try {
		const results = await PostCsv(params)
		res.status(200).json({ message: "Import Successful!" })
	} catch (err) {
		console.error("Error at database/import/postCsv :", err)
		res.status(500).json({ error: "Internal Server Error" })
	}
}
