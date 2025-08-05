import { MongoClient } from "mongodb"
import { excelImportRow } from "@/types/excelImportTypes"

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

// Helper to convert string numbers to numbers, except for date fields
function preprocessRow(row: excelImportRow): excelImportRow {
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

async function postCsv(params: excelImportRow[]) {
	const client = new MongoClient(process.env.DB_CONNECTION_URI as string)
	const collection = client
		.db("main")
		.collection<excelImportRow>("collection")
	const normalizedParams: excelImportRow[] = params.map(preprocessRow)
	console.log(normalizedParams)
	await collection.insertMany(normalizedParams)
}

// handler for any calls to this endpoint
export default async function handler(req: any, res: any) {
	const params = req.body.records
	console.log(params)

	try {
		const results = await postCsv(params)
		res.status(200).json(results)
	} catch (err) {
		res.status(500).json(err)
	}
}
