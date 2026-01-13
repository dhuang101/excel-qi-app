import { GroupedBarplot } from "@/components/summary/GroupedBarplot"
import VerticalBarplot from "@/components/summary/VerticalBarplot"
import CircularProgress from "@mui/material/CircularProgress/CircularProgress"
import axios from "axios"
import { useEffect, useCallback, useState } from "react"

interface CaseData {
	cards: {
		total: { count: number; mortalityRate: number }
		va: { count: number; mortalityRate: number }
		vv: { count: number; mortalityRate: number }
	}
}

interface GraphData {
	mortalityDist: { ageRange: string; value: number }[]
	caseDist: { ageRange: string; value: number }[]
	caseDeathDist: {
		ageRange: string
		totalCases: number
		totalDeaths: number
	}[]
}

type EcmoMode = "total" | "V-V" | "V-A"
// | "V-VA"
// | "A-VCO2R"
// | "V-VECCO2R"
// | "VP"

function SummaryPage() {
	// state attributes for query
	const [availableYears, setAvailableYears] = useState([])
	const [selectedYear, setSelectedYear] = useState(0)
	const [ecmoMode, setEcmoMode] = useState<EcmoMode>("total")
	// state attributes for returned data
	const [caseData, setCaseData] = useState<CaseData | null>(null)
	const [graphData, setGraphData] = useState<GraphData | null>(null)
	const [width, setWidth] = useState(500)

	// dynamically assigns width variable to create responsive d3 graphs
	const graphRef = useCallback((node: HTMLDivElement | null) => {
		if (node !== null) {
			const resizeObserver = new ResizeObserver((entries) => {
				setWidth(entries[0].contentRect.width)
			})

			resizeObserver.observe(node)
		}
	}, [])

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
				setCaseData(result.data)
			})
	}, [selectedYear])

	useEffect(() => {
		if (selectedYear === 0) return

		axios
			.post("api/database/summary/getGraphData", {
				selectedYear: selectedYear,
				ecmoMode: ecmoMode,
			})
			.then((result) => {
				console.log(result.data)
				setGraphData(result.data)
			})
	}, [selectedYear, ecmoMode])

	function handleButtonClick(mode: EcmoMode) {
		setEcmoMode(mode)
	}

	return !caseData || !graphData ? (
		<div className="flex flex-col justify-center items-center h-[83vh]">
			<CircularProgress size={80} />
			<article className="text-lg font-semibold pt-4">
				Fetching Data...
			</article>
		</div>
	) : (
		<div className="flex flex-col w-full items-center justify-center">
			<div className="flex flex-col w-2/3 mt-2">
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
								{caseData.cards.total.count}
							</article>
							<article className="mt-2">
								{`Mortality: ${caseData.cards.total.mortalityRate}%`}
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
								{caseData.cards.va.count}
							</article>
							<article className="mt-2">
								{`Mortality: ${caseData.cards.va.mortalityRate}%`}
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
								{caseData.cards.vv.count}
							</article>
							<article className="mt-2">
								{`Mortality: ${caseData.cards.vv.mortalityRate}%`}
							</article>
						</div>
					</div>
				</div>
				<div className="flex justify-between w-full mt-4 outline outline-primary p-2 shadow-2xl rounded">
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
				<div className="flex flex-col w-full mt-4 outline outline-primary shadow-2xl rounded">
					<div className="flex justify-center w-full bg-primary py-2">
						<article className="text-primary-content font-semibold">{`Total (${selectedYear}) - Mortality distribution by age group`}</article>
					</div>
					<div
						ref={graphRef}
						className="flex w-full justify-center p-4"
					>
						<VerticalBarplot
							data={graphData.mortalityDist}
							width={width}
							height={500}
						/>
					</div>
				</div>
				<div className="flex flex-col w-full mt-4 outline outline-primary shadow-2xl rounded">
					<div className="flex justify-center w-full bg-primary py-2">
						<article className="text-primary-content font-semibold">{`Total (${selectedYear}) - Age distribution of cases vs deaths`}</article>
					</div>
					<div className="flex w-full justify-center p-4">
						<GroupedBarplot
							data={graphData.caseDeathDist}
							width={width}
							height={500}
						/>
					</div>
				</div>
				<div className="flex flex-col w-full mt-4 outline outline-primary shadow-2xl rounded">
					<div className="flex justify-center w-full bg-primary py-2">
						<article className="text-primary-content font-semibold">{`Total (${selectedYear}) - Age distribution of cases`}</article>
					</div>
					<div className="flex w-full justify-center p-4">
						<VerticalBarplot
							data={graphData.caseDist}
							width={width}
							height={500}
						/>
					</div>
				</div>
			</div>
			{/* footer */}
			<div className="h-8" />
		</div>
	)
}

export default SummaryPage
