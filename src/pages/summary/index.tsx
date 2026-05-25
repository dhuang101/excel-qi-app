import { GroupedBarplot } from "@/components/summary/GroupedBarplot"
import { PieChart } from "@/components/summary/PieChart"
import VerticalBarplot from "@/components/summary/VerticalBarplot"
import { FormatName } from "@/utilities/FormatName"
import SummaryReducer, { ACTION } from "@/reducers/summaryReducer"
import CircularProgress from "@mui/material/CircularProgress/CircularProgress"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useCallback, useState, useReducer } from "react"
import React from "react"

const MONTHS = [
	{ label: "All Year", value: 0 },
	{ label: "January", value: 1 },
	{ label: "February", value: 2 },
	{ label: "March", value: 3 },
	{ label: "April", value: 4 },
	{ label: "May", value: 5 },
	{ label: "June", value: 6 },
	{ label: "July", value: 7 },
	{ label: "August", value: 8 },
	{ label: "September", value: 9 },
	{ label: "October", value: 10 },
	{ label: "November", value: 11 },
	{ label: "December", value: 12 },
]

interface CaseData {
	total: { count: number; mortalityRate: number }
	va: { count: number; mortalityRate: number }
	vv: { count: number; mortalityRate: number }
}

interface GraphData {
	mortalityDist: { ageRange: string; value: number }[]
	caseDist: { ageRange: string; value: number }[]
	caseDeathDist: {
		ageRange: string
		totalCases: number
		totalDeaths: number
	}[]
	genderDist: {
		gender: "Male" | "Female"
		percentOfTotal: number
		mortalityRate: number
	}[]
}

type EcmoMode = "total" | "V-V" | "V-A"

function SummaryPage() {
	// auth session
	const { data: session, status } = useSession()

	const [state, dispatch] = useReducer(SummaryReducer, {
		sites: [],
		years: {},
		ecmo_data: {},
		graph_data: {},
	})
	// state attributes selector at the top
	const [availableYears, setAvailableYears] = useState([])
	const [selectedYear, setSelectedYear] = useState(0)
	const [selectedMonth, setSelectedMonth] = useState(0)
	const [ecmoMode, setEcmoMode] = useState<EcmoMode>("total")
	// state attributes for displayed data
	const [selectedSite, setSelectedSite] = useState("all_sites")
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
		axios
			.post("/api/database/summary/getAvailableYears", {
				role: session ? session?.user.role : "public",
				sites: session ? session?.user.sites : [],
			})
			.then((result) => {
				dispatch({
					type: ACTION.SET_SITES_YEARS,
					payload: {
						sites: Object.keys(result.data),
						years: result.data,
					},
				})
				setAvailableYears(result.data["all_sites"])
				setSelectedYear(result.data["all_sites"].at(-1))
			})
	}, [session])

	useEffect(() => {
		if (selectedYear === 0) return

		axios
			.post("api/database/summary/getCaseStats", {
				role: session ? session?.user.role : "public",
				sites: session ? session?.user.sites : [],
				selectedYear,
				selectedMonth,
			})
			.then((result) => {
				dispatch({ type: ACTION.SET_ECMO_STATS, payload: result.data })
			})
	}, [selectedYear, selectedMonth, session])

	useEffect(() => {
		if (selectedYear === 0) return

		axios
			.post("api/database/summary/getGraphData", {
				role: session ? session?.user.role : "public",
				sites: session ? session?.user.sites : [],
				selectedYear,
				selectedMonth,
				ecmoMode: ecmoMode,
			})
			.then((result) => {
				dispatch({ type: ACTION.SET_GRAPH_DATA, payload: result.data })
			})
	}, [selectedYear, selectedMonth, ecmoMode, session])

	useEffect(() => {
		setAvailableYears(state.years[selectedSite])
		setCaseData(state.ecmo_data[selectedSite])
		setGraphData(state.graph_data[selectedSite])
	}, [state, selectedSite])

	function handleButtonClick(mode: EcmoMode) {
		setEcmoMode(mode)
	}

	return caseData === null || graphData === null || !availableYears ? (
		<div className="flex flex-col justify-center items-center h-[83vh]">
			<CircularProgress size={80} />
			<article className="text-lg font-semibold pt-4">
				Fetching Data...
			</article>
		</div>
	) : (
		<div className="flex flex-col w-full items-center justify-center p-4">
			<div className="flex flex-col w-full lg:w-2/3 mt-2">
				<div className="flex flex-col md:flex-row justify-between gap-4">
					{status === "authenticated" && (
						<fieldset className="fieldset w-full md:w-1/3">
							<legend className="fieldset-legend">
								Select Site
							</legend>
							<select
								defaultValue={availableYears[0]}
								className="select select-bordered w-full"
								onChange={(event) =>
									setSelectedSite(event.target.value)
								}
							>
								{state.sites.map((site: string) => (
									<option key={site} value={site}>
										{FormatName(site)}
									</option>
								))}
							</select>
						</fieldset>
					)}
					<fieldset className="fieldset w-full md:w-1/3">
						<legend className="fieldset-legend">
							Select Month
						</legend>
						<select
							className="select select-bordered w-full"
							value={selectedMonth}
							onChange={(e) =>
								setSelectedMonth(Number(e.target.value))
							}
						>
							{MONTHS.map((m) => (
								<option key={m.value} value={m.value}>
									{m.label}
								</option>
							))}
						</select>
					</fieldset>
				</div>

				<article className="text-lg w-full mt-6">
					Available Years
				</article>
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
					<div className="flex justify-between px-3 mt-2 text-xs opacity-50">
						{availableYears.map((_, i) => (
							<span key={i}>|</span>
						))}
					</div>
					<div className="flex justify-between mt-2 text-sm font-medium">
						{availableYears.map((year) => (
							<span key={year}>{year}</span>
						))}
					</div>
				</div>

				<div className="alert alert-primary mt-6 shadow-sm rounded-lg flex gap-2 items-center text-sm">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						className="h-6 w-6 shrink-0 stroke-current"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span>
						The summary figures and charts below only reflect data
						collected during the selected month and year:{" "}
						<strong>
							{`${MONTHS.find((m) => m.value === selectedMonth)?.label} - `}
							{selectedYear}
						</strong>
						.
					</span>
				</div>
				{caseData === undefined || graphData === undefined ? (
					<div className="flex flex-col items-center justify-center min-h-[40vh] mt-12 p-8 border-base-300 rounded-xl text-center bg-base-50">
						<article className="text-2xl font-semibold text-base-content">
							No Case Data Found
						</article>
						<p className="mt-2 text-md text-base-content/60 max-w-md">
							There are no recorded instances matching your
							selected site, month, or year configuration. Try
							altering your filters above.
						</p>
					</div>
				) : (
					<React.Fragment>
						<div className="flex flex-col md:flex-row justify-between w-full mt-8 gap-4">
							{[
								{ label: "Total Cases", data: caseData.total },
								{ label: "V-A Cases", data: caseData.va },
								{ label: "V-V Cases", data: caseData.vv },
							].map((card, idx) => (
								<div
									key={idx}
									className="flex flex-col w-full md:w-[31%] shadow-sm rounded-lg overflow-hidden outline outline-base-300"
								>
									<div className="flex min-h-12 items-center justify-center bg-base-300">
										<article className="font-semibold text-base-content text-lg tracking-tight">
											{card.label}
										</article>
									</div>
									<div className="flex flex-col min-h-24 items-center justify-center bg-base-100">
										<article className="text-4xl font-bold">
											{card.data.count}
										</article>
										<article className="mt-1 text-sm opacity-70">
											{`Mortality: ${card.data.mortalityRate}%`}
										</article>
									</div>
								</div>
							))}
						</div>

						<div className="flex flex-col sm:flex-row justify-between w-full mt-8 gap-2 bg-base-200 p-2 rounded-lg">
							{["total", "V-A", "V-V"].map((mode) => (
								<button
									key={mode}
									className={`btn flex-1 ${ecmoMode === mode ? "btn-primary" : "btn-ghost"}`}
									onClick={() =>
										handleButtonClick(mode as EcmoMode)
									}
								>
									{mode === "total" ? "Total" : mode} Cases
								</button>
							))}
						</div>

						<div className="space-y-8 mt-8">
							{[
								{
									title: "Mortality distribution by age",
									component: (
										<VerticalBarplot
											data={graphData.mortalityDist}
											width={width}
											height={400}
										/>
									),
								},
								{
									title: "Age distribution: Cases vs Deaths",
									component: (
										<GroupedBarplot
											data={graphData.caseDeathDist}
											width={width}
											height={400}
										/>
									),
								},
								{
									title: "Age distribution of cases",
									component: (
										<VerticalBarplot
											data={graphData.caseDist}
											width={width}
											height={400}
										/>
									),
								},
							].map((graph, idx) => (
								<div
									key={idx}
									className="flex flex-col w-full outline outline-base-300 shadow-xl rounded-xl overflow-hidden"
								>
									<div className="flex justify-center w-full bg-base-300 py-3 px-4 text-center">
										<article className="text-base-content font-semibold text-sm md:text-base">
											{`${graph.title} (${selectedMonth > 0 ? `${MONTHS.find((m) => m.value === selectedMonth)?.label} - ` : ""}${selectedYear})`}
										</article>
									</div>
									<div
										ref={idx === 0 ? graphRef : null}
										className="flex w-full justify-center p-2 md:p-4 overflow-x-hidden"
									>
										{graph.component}
									</div>
								</div>
							))}
						</div>

						<div className="flex flex-col lg:flex-row justify-between mt-8 gap-6">
							<div className="flex flex-col w-full lg:w-[49%] outline outline-base-300 shadow-xl rounded-xl overflow-hidden">
								<div className="flex justify-center w-full bg-base-300 py-3 text-center">
									<article className="text-base-content font-semibold text-sm">
										Gender Distribution: Cases
									</article>
								</div>
								<div className="flex w-full justify-center p-4">
									<PieChart
										data={graphData.genderDist}
										categoryKey="gender"
										valueKey="percentOfTotal"
										width={
											width > 600 ? width / 2 : width - 40
										}
										height={300}
									/>
								</div>
							</div>
							<div className="flex flex-col w-full lg:w-[49%] outline outline-base-300 shadow-xl rounded-xl overflow-hidden">
								<div className="flex justify-center w-full bg-base-300 py-3 text-center">
									<article className="text-base-content font-semibold text-sm">
										Gender Distribution: Deaths
									</article>
								</div>
								<div className="flex w-full justify-center p-4">
									<PieChart
										data={graphData.genderDist}
										categoryKey="gender"
										valueKey="mortalityRate"
										width={
											width > 600 ? width / 2 : width - 40
										}
										height={300}
									/>
								</div>
							</div>
						</div>
					</React.Fragment>
				)}
			</div>
			<div className="h-12" />
		</div>
	)
}

export default SummaryPage
