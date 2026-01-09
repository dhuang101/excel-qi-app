import CircularProgress from "@mui/material/CircularProgress/CircularProgress"
import axios from "axios"
import { useEffect, useState } from "react"

interface SummaryData {
	cards: {
		total: { count: number; mortalityRate: number }
		va: { count: number; mortalityRate: number }
		vv: { count: number; mortalityRate: number }
	}
}

type EcmoMode = "total" | "V-V" | "V-A"

function SummaryPage() {
	// state attributes for query
	const [availableYears, setAvailableYears] = useState([])
	const [selectedYear, setSelectedYear] = useState(0)
	const [ecmoMode, setEcmoMode] = useState<EcmoMode>("total")
	// state attributes for returned data
	const [data, setData] = useState<SummaryData | null>(null)

	useEffect(() => {
		axios.get("/api/database/summary/getAvailableYears").then((result) => {
			setAvailableYears(result.data)
			setSelectedYear(result.data.at(-1))
		})
	}, [])

	useEffect(() => {
		if (selectedYear === 0) return

		axios
			.post("api/database/summary/getCaseStats", {
				selectedYear: selectedYear,
			})
			.then((result) => {
				setData(result.data)
			})
	}, [selectedYear])

	function handleButtonClick(mode: EcmoMode) {
		setEcmoMode(mode)
	}

	return !data ? (
		<div className="flex flex-col justify-center items-center h-[83vh]">
			<CircularProgress size={80} />
			<article className="text-lg font-semibold pt-4">
				Fetching Data...
			</article>
		</div>
	) : (
		<div className="flex flex-col w-full items-center justify-center">
			<div className="flex flex-col w-4/5 mt-2">
				<article className="text-lg w-full">Available Years</article>
				<div className="w-full">
					<input
						type="range"
						min={availableYears[0]}
						max={availableYears.at(-1)}
						value={selectedYear}
						onChange={(e) =>
							setSelectedYear(Number(e.target.value))
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
							<article className="text-3xl">
								{data.cards.total.count}
							</article>
							<article className="mt-2">
								{`Mortality: ${data.cards.total.mortalityRate}%`}
							</article>
						</div>
					</div>
					<div className="flex flex-col w-[30%]">
						<div className="flex min-h-12 items-center justify-center rounded-t-md bg-primary  outline outline-primary">
							<article className="font-semibold text-primary-content text-xl">
								V-A Cases
							</article>
						</div>
						<div className="flex flex-col min-h-24 items-center justify-center rounded-b-md outline outline-primary">
							<article className="text-3xl">
								{data.cards.va.count}
							</article>
							<article className="mt-2">
								{`Mortality: ${data.cards.va.mortalityRate}%`}
							</article>
						</div>
					</div>
					<div className="flex flex-col w-[30%]">
						<div className="flex min-h-12 items-center justify-center rounded-t-md bg-primary  outline outline-primary">
							<article className="font-semibold text-primary-content text-xl">
								V-V Cases
							</article>
						</div>
						<div className="flex flex-col min-h-24 items-center justify-center rounded-b-md outline outline-primary">
							<article className="text-3xl">
								{data.cards.vv.count}
							</article>
							<article className="mt-2">
								{`Mortality: ${data.cards.vv.mortalityRate}%`}
							</article>
						</div>
					</div>
				</div>
				<div className="flex justify-between w-full mt-4 outline outline-primary p-2 shadow-2xl">
					<button
						className={`btn w-[30%] ${
							ecmoMode === "total" ? "btn-primary" : ""
						}`}
						onClick={() => {
							handleButtonClick("total")
						}}
					>
						Total Cases
					</button>
					<button
						className={`btn w-[30%] ${
							ecmoMode === "V-A" ? "btn-primary" : ""
						}`}
						onClick={() => {
							handleButtonClick("V-A")
						}}
					>
						V-A Cases
					</button>
					<button
						className={`btn w-[30%] ${
							ecmoMode === "V-V" ? "btn-primary" : ""
						}`}
						onClick={() => {
							handleButtonClick("V-V")
						}}
					>
						V-V Cases
					</button>
				</div>
			</div>
		</div>
	)
}

export default SummaryPage
