import axios from "axios"
import { useEffect, useState } from "react"

interface QueryAttributes {
	selectedYear: number
	ecmoMode: "total" | "VV" | "VA"
}

function SummaryPage() {
	const [availableYears, setAvailableYears] = useState([])
	const [queryAttributes, setQueryAttributes] = useState<QueryAttributes>({
		selectedYear: 0,
		ecmoMode: "total",
	})

	useEffect(() => {
		axios.get("/api/database/summary/getAvailableYears").then((result) => {
			setAvailableYears(result.data)
			setQueryAttributes((prev) => ({
				...prev,
				selectedYear: result.data.at(-1),
			}))
		})
	}, [])

	function handleButtonClick(mode: QueryAttributes["ecmoMode"]) {
		setQueryAttributes((prev) => ({
			...prev,
			ecmoMode: mode,
		}))
	}

	return (
		<div className="flex flex-col w-full items-center justify-center">
			<div className="flex flex-col w-4/5 mt-2">
				<article className="text-lg w-full">Available Years</article>
				<div className="w-full">
					<input
						type="range"
						min={availableYears[0]}
						max={availableYears.at(-1)}
						value={queryAttributes.selectedYear}
						onChange={(e) =>
							setQueryAttributes((prev) => ({
								...prev,
								selectedYear: Number(e.target.value),
							}))
						}
						className="range range-primary [--range-fill:0] w-full"
						step={1}
					/>
					<div className="flex justify-between px-3 mt-2 text-xs">
						{availableYears.map((year, i) => (
							<span key={i}>|</span>
						))}
					</div>
					<div className="flex justify-between mt-2 text-sm">
						{availableYears.map((year) => (
							<span key={year}>{year}</span>
						))}
					</div>
				</div>
				<div className="flex justify-between w-full mt-4">
					<div className="flex flex-col w-[30%]">
						<div className="flex min-h-12 items-center justify-center rounded-t-md bg-primary  outline outline-primary">
							<article className="font-semibold text-primary-content text-xl">
								Total Cases
							</article>
						</div>
						<div className="flex flex-col min-h-24 items-center justify-center rounded-b-md outline outline-primary">
							<article className="text-3xl">10000</article>
							<article className="mt-2">
								Mortality: 10.00%
							</article>
						</div>
					</div>
					<div className="flex flex-col w-[30%]">
						<div className="flex min-h-12 items-center justify-center rounded-t-md bg-primary  outline outline-primary">
							<article className="font-semibold text-primary-content text-xl">
								VA Cases
							</article>
						</div>
						<div className="flex flex-col min-h-24 items-center justify-center rounded-b-md outline outline-primary">
							<article className="text-3xl">10000</article>
							<article className="mt-2">
								Mortality: 10.00%
							</article>
						</div>
					</div>
					<div className="flex flex-col w-[30%]">
						<div className="flex min-h-12 items-center justify-center rounded-t-md bg-primary  outline outline-primary">
							<article className="font-semibold text-primary-content text-xl">
								VV Cases
							</article>
						</div>
						<div className="flex flex-col min-h-24 items-center justify-center rounded-b-md outline outline-primary">
							<article className="text-3xl">10000</article>
							<article className="mt-2">
								Mortality: 10.00%
							</article>
						</div>
					</div>
				</div>
				<div className="flex justify-between w-full mt-4 outline outline-primary p-2 shadow-2xl">
					<button
						className={`btn w-[30%] ${
							queryAttributes.ecmoMode === "total"
								? "btn-primary"
								: ""
						}`}
						onClick={() => {
							handleButtonClick("total")
						}}
					>
						Total Cases
					</button>
					<button
						className={`btn w-[30%] ${
							queryAttributes.ecmoMode === "VA"
								? "btn-primary"
								: ""
						}`}
						onClick={() => {
							handleButtonClick("VA")
						}}
					>
						VA Cases
					</button>
					<button
						className={`btn w-[30%] ${
							queryAttributes.ecmoMode === "VV"
								? "btn-primary"
								: ""
						}`}
						onClick={() => {
							handleButtonClick("VV")
						}}
					>
						VV Cases
					</button>
				</div>
			</div>
		</div>
	)
}

export default SummaryPage
