import axios from "axios"

async function PostEcmoPalEvaluate(variables: any) {
	let result = await axios.post(
		`${process.env.ECMOPAL_API_URL}/evaluate`,
		variables
	)

	result.data.altering_features.sort(
		(a: { value: number }, b: { value: number }) => {
			return Math.abs(b.value) - Math.abs(a.value)
		}
	)

	return result.data
}

// handler for any calls to this endpoint
export default async function handler(req: any, res: any) {
	const params = req.body

	try {
		const result = await PostEcmoPalEvaluate(params.variables)
		res.status(200).json(result)
	} catch (err) {
		console.error("Error at ecmo-pal/evaluate :", err)
		res.status(500).json({ error: "Internal Server Error" })
	}
}
