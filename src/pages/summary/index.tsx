import axios from "axios"
import { useEffect, useState } from "react"

function SummaryPage() {
	const [availableYears, setAvailableYears] = useState([])

	useEffect(() => {
		axios.get("/api/database/summary/getAvailableYears").then((result) => {
			setAvailableYears(result.data)
		})
	}, [])

	return (
		<div className="flex flex-col w-full items-center justify-center">
			<div className="flex flex-col w-4/5 mt-2">
				<article className="text-lg w-full">Available Years</article>
				<div className="w-full">
					<input
						type="range"
						min={0}
						max="100"
						value="25"
						className="range range-primary [--range-fill:0] w-full"
						step="25"
					/>
					<div className="flex justify-between px-2.5 mt-2 text-xs">
						<span>|</span>
						<span>|</span>
						<span>|</span>
						<span>|</span>
						<span>|</span>
					</div>
					<div className="flex justify-between px-2.5 mt-2 text-xs">
						<span>1</span>
						<span>2</span>
						<span>3</span>
						<span>4</span>
						<span>5</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SummaryPage
