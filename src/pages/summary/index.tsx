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
	sexDist: {
		sex: "Male" | "Female"
		percentOfTotal: number
		mortalityRate: number
	}[]
}

type EcmoMode = "total" | "V-V" | "V-A"

function SummaryPage() {
	const { data: session, status } = useSession()

	const [state, dispatch] = useReducer(SummaryReducer, {
		sites: [],
		years: {},
		ecmo_data: {},
		graph_data: {},
	})

	const [availableYears, setAvailableYears] = useState<number[]>([])
	const [selectedYear, setSelectedYear] = useState(0)
	const [selectedMonth, setSelectedMonth] = useState(0)
	const [ecmoMode, setEcmoMode] = useState<EcmoMode>("total")
	const [selectedSite, setSelectedSite] = useState("all_sites")
	const [caseData, setCaseData] = useState<CaseData | null>(null)
	const [graphData, setGraphData] = useState<GraphData | null>(null)
	const [width, setWidth] = useState(500)

	const [initialLoading, setInitialLoading] = useState(true)
	const [casesLoading, setCasesLoading] = useState(false)
	const [graphsLoading, setGraphsLoading] = useState(false)

	const graphRef = useCallback((node: HTMLDivElement | null) => {
		if (node !== null) {
			const resizeObserver = new ResizeObserver((entries) => {
				setWidth(entries[0].contentRect.width)
			})
			resizeObserver.observe(node)
		}
	}, [])

	useEffect(() => {
		setInitialLoading(true)
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
				const initialYears = result.data["all_sites"] || []
				setAvailableYears(initialYears)
				if (initialYears.length > 0) {
					setSelectedYear(initialYears.at(-1))
				}
			})
			.catch((err) => console.error(err))
			.finally(() => setInitialLoading(false))
	}, [session])

	useEffect(() => {
		if (selectedYear === 0) return

		setCasesLoading(true)
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
			.catch((err) => console.error(err))
			.finally(() => setCasesLoading(false))
	}, [selectedYear, selectedMonth, session])

	useEffect(() => {
		if (
			selectedYear === 0 ||
			!caseData ||
			Object.keys(caseData).length === 0
		)
			return

		setGraphsLoading(true)
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
			.catch((err) => console.error(err))
			.finally(() => setGraphsLoading(false))
	}, [selectedYear, selectedMonth, ecmoMode, caseData, session])

	useEffect(() => {
		const siteYears = state.years[selectedSite] || []
		setAvailableYears(siteYears)

		setCaseData(state.ecmo_data[selectedSite] || null)
		setGraphData(state.graph_data[selectedSite] || null)

		if (siteYears.length > 0 && !siteYears.includes(selectedYear)) {
			setSelectedYear(siteYears.at(-1))
		}
	}, [state, selectedSite, selectedYear])

	function handleButtonClick(mode: EcmoMode) {
		setEcmoMode(mode)
	}

	if (initialLoading && availableYears.length === 0) {
		return (
			<div className="flex flex-col justify-center items-center h-[83vh]">
				<CircularProgress size={80} />
				<article className="text-lg font-semibold pt-4">
					Fetching Initial Data...
				</article>
			</div>
		)
	}

	const checkIsGraphDataEmpty = (data: GraphData | null): boolean => {
		if (!data || Object.keys(data).length === 0) return true

		const totalValueDist = (data.mortalityDist || []).reduce(
			(sum, item) => sum + (item.value || 0),
			0,
		)
		const totalCaseDist = (data.caseDist || []).reduce(
			(sum, item) => sum + (item.value || 0),
			0,
		)
		const totalSexDist = (data.sexDist || []).reduce(
			(sum, item) =>
				sum + (item.percentOfTotal || 0) + (item.mortalityRate || 0),
			0,
		)
		const totalCaseDeathDist = (data.caseDeathDist || []).reduce(
			(sum, item) =>
				sum + (item.totalCases || 0) + (item.totalDeaths || 0),
			0,
		)

		return (
			totalValueDist +
				totalCaseDist +
				totalSexDist +
				totalCaseDeathDist ===
			0
		)
	}

	const hasNoCaseData = !caseData || Object.keys(caseData).length === 0
	const hasNoGraphData = !graphData || checkIsGraphDataEmpty(graphData)

	return (
		<div className="flex flex-col w-full items-center justify-center p-4">
			<div className="flex flex-col w-full lg:w-2/3 mt-2">
				{/* Filters Row */}
				<div className="flex flex-col md:flex-row justify-between gap-4">
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
				</div>

				{/* Range Slider */}
				<article className="text-lg w-full mt-6">
					Available Years
				</article>
				<div className="w-full relative">
					<input
						type="range"
						min={0}
						max={
							availableYears.length > 0
								? availableYears.length - 1
								: 0
						}
						value={
							availableYears.indexOf(selectedYear) !== -1
								? availableYears.indexOf(selectedYear)
								: 0
						}
						onChange={(e) => {
							const index = Number(e.target.value)
							const actualYear = availableYears[index]
							if (actualYear) {
								setSelectedYear(actualYear)
							}
						}}
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

				{/* Alert Notification Header */}
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
					<article>
						The summary figures and charts below only reflect data
						collected during the selected month and year:{" "}
						<strong>
							{`${MONTHS.find((m) => m.value === selectedMonth)?.label} - `}
							{selectedYear}
						</strong>
						.
					</article>
				</div>

				{/* --- MAIN CONDITIONAL RENDERING BLOCK --- */}
				{hasNoCaseData ? (
					<div className="flex flex-col items-center justify-center min-h-[30vh] mt-8 p-8 border border-dashed border-base-300 rounded-xl text-center bg-base-50">
						<article className="text-xl font-semibold text-base-content">
							No Case Data Found
						</article>
						<p className="mt-1 text-sm text-base-content/60 max-w-sm">
							There are no cases recorded for the filters
							currently selected, please try adjusting the month
							or year to view available data and graphs.
						</p>
					</div>
				) : (
					<React.Fragment>
						{/* Summary Cards Layout */}
						<div
							className={`transition-opacity duration-200 ${casesLoading ? "opacity-40 pointer-events-none" : "opacity-100"}`}
						>
							<div className="flex flex-col md:flex-row justify-between w-full mt-8 gap-4">
								{[
									{
										label: "Total Cases",
										data: caseData.total,
									},
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
												{card.data?.count ?? 0}
											</article>
											<article className="mt-1 text-sm opacity-70">
												{`Mortality: ${card.data?.mortalityRate ?? 0}%`}
											</article>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Mode Selectors */}
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

						{/* --- GRAPH VISUALIZATION SUB-SECTION --- */}
						<div
							className={`transition-opacity duration-200 ${graphsLoading ? "opacity-40 pointer-events-none" : "opacity-100"}`}
						>
							{hasNoGraphData ? (
								<div className="flex flex-col items-center justify-center min-h-[40vh] mt-8 p-8 border border-dashed border-base-300 rounded-xl text-center bg-base-50">
									<article className="text-2xl font-semibold text-base-content">
										No Graph Data Found
									</article>
									<p className="mt-2 text-md text-base-content/60 max-w-md">
										There are no cases recorded for the
										filters currently selected, please try
										adjusting the month, year, or ECMO mode
										to view available graphs.
									</p>
								</div>
							) : (
								<React.Fragment>
									{/* Pie Charts Layout */}
									<div className="flex flex-col lg:flex-row justify-between mt-8 gap-6">
										<div className="flex flex-col w-full lg:w-[49%] outline outline-base-300 shadow-xl rounded-xl overflow-hidden">
											<div className="flex justify-center w-full bg-base-300 py-3 text-center">
												<article className="text-base-content font-semibold text-sm">
													Sex Distribution: Cases
												</article>
											</div>
											<div className="flex w-full justify-center p-4">
												<PieChart
													data={
														graphData.sexDist || []
													}
													categoryKey="sex"
													valueKey="percentOfTotal"
													width={
														width > 600
															? width / 2
															: width - 40
													}
													height={300}
												/>
											</div>
										</div>
										<div className="flex flex-col w-full lg:w-[49%] outline outline-base-300 shadow-xl rounded-xl overflow-hidden">
											<div className="flex justify-center w-full bg-base-300 py-3 text-center">
												<article className="text-base-content font-semibold text-sm">
													Sex Distribution: Deaths
												</article>
											</div>
											<div className="flex w-full justify-center p-4">
												<PieChart
													data={
														graphData.sexDist || []
													}
													categoryKey="sex"
													valueKey="mortalityRate"
													width={
														width > 600
															? width / 2
															: width - 40
													}
													height={300}
												/>
											</div>
										</div>
									</div>

									{/* Bar Plots Layout */}
									<div className="space-y-8 mt-8">
										{[
											{
												title: "Mortality distribution by age",
												component: (
													<VerticalBarplot
														data={
															graphData.mortalityDist ||
															[]
														}
														width={width}
														height={400}
													/>
												),
											},
											{
												title: "Age distribution: Cases vs Deaths",
												component: (
													<GroupedBarplot
														data={
															graphData.caseDeathDist ||
															[]
														}
														width={width}
														height={400}
													/>
												),
											},
											{
												title: "Age distribution of cases",
												component: (
													<VerticalBarplot
														data={
															graphData.caseDist ||
															[]
														}
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
													ref={
														idx === 0
															? graphRef
															: null
													}
													className="flex w-full justify-center p-2 md:p-4 overflow-x-hidden"
												>
													{graph.component}
												</div>
											</div>
										))}
									</div>
								</React.Fragment>
							)}
						</div>
					</React.Fragment>
				)}
			</div>
			<div className="h-12" />
		</div>
	)
}

export default SummaryPage
