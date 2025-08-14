function GetFiles(params: any) {}

// handler for any calls to this endpoint
export default async function handler(req: any, res: any) {
	const params = req.body.records

	try {
		const results = await GetFiles(params)
		res.status(200).json(results)
	} catch (err) {
		res.status(500).json(err)
	}
}
