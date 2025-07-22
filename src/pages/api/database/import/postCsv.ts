import { MongoClient } from "mongodb"
import { excelImportRow } from "@/types/excelImportTypes"

// this api takes the translated and merged rows from the CSV import
// and inserts them into the database

async function postCsv(params: excelImportRow[]) {
	const client = new MongoClient(process.env.DB_CONNECTION_URI as string)
	const collection = client
		.db("main")
		.collection<excelImportRow>("collection")
	await collection.insertMany(params)
	return { message: "Records inserted successfully" }
}

// handler for any calls to this endpoint
export default async function handler(req: any, res: any) {
	const params = req.body.records

	try {
		const results = await postCsv(params)
		res.status(200).json(results)
	} catch (err) {
		res.status(500).json(err)
	}
}
