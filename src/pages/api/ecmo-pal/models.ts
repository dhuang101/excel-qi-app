import axios from "axios"

async function getEcmoPalModels() {
	let result = await axios.get(`${process.env.ECMOPAL_API_URL}/models`)
	return result.data
}

// handler for any calls to this endpoint
export default async function handler(req: any, res: any) {
	try {
		const result = await getEcmoPalModels()
		res.status(200).json(result)
	} catch (err) {
		res.status(500).json(err)
	}
}
