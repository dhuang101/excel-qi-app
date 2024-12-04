import axios from "axios"
import { useEffect, useState } from "react"

function ReportingPage() {
	const [summary, setSummary] = useState({})

	useEffect(() => {
		axios.get("/api/database/getSummary").then((result) => {
			// setSummary(result.data[0])
			console.log(result.data)
		})
	}, [])

	return (
		<div className="flex flex-col flex-grow w-full items-center">
			<div className="flex flex-col w-2/3 h-full items-center">
				<article className="my-4 text-xl font-semibold">
					There are currently {summary.totalDocuments} patients
					enrolled in the NICE Data Project.
				</article>
			</div>
		</div>
	)
}

export default ReportingPage
