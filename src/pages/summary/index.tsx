import { GroupedBarplot } from "@/components/summary/GroupedBarplot"
import { PieChart } from "@/components/summary/PieChart"
import VerticalBarplot from "@/components/summary/VerticalBarplot"
import { FormatName } from "@/utilities/FormatName"
import SummaryReducer, { ACTION } from "@/reducers/summaryReducer"
import CircularProgress from "@mui/material/CircularProgress/CircularProgress"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useCallback, useState, useReducer } from "react"

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
// | "V-VA"
// | "A-VCO2R"
// | "V-VECCO2R"
// | "VP"

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
				<div className="flex justify-between">
					{status === "authenticated" && (
						<fieldset className="fieldset w-1/3">
							<legend className="fieldset-legend">
								Select Site to Display
							</legend>
							<select
								defaultValue={availableYears[0]}
								className="select"
								onChange={(event) => {
									setSelectedSite(event.target.value)
								}}
							>
								{state.sites.map((site: string) => {
									return (
										<option key={site} value={site}>
											{FormatName(site)}
										</option>
									)
								})}
							</select>
						</fieldset>
					)}
					<fieldset className="fieldset w-1/3">
						<legend className="fieldset-legend">
							Select Month
						</legend>
						<select
							className="select"
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

				<article className="text-lg w-full mt-2">
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
								{caseData.total.count}
							</article>
							<article className="mt-2">
								{`Mortality: ${caseData.total.mortalityRate}%`}
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
								{caseData.va.count}
							</article>
							<article className="mt-2">
								{`Mortality: ${caseData.va.mortalityRate}%`}
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
								{caseData.vv.count}
							</article>
							<article className="mt-2">
								{`Mortality: ${caseData.vv.mortalityRate}%`}
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
				<div className="flex justify-between mt-4">
					<div className="flex flex-col w-[49%] outline outline-primary shadow-2xl rounded">
						<div className="flex justify-center w-full bg-primary py-2">
							<article className="text-primary-content font-semibold">{`Total (${selectedYear}) - Gender distribution of cases`}</article>
						</div>
						<div className="flex w-full justify-center p-4">
							<PieChart
								data={graphData.genderDist}
								categoryKey={"gender"}
								valueKey={"percentOfTotal"}
								width={width / 1.75}
								height={400}
							/>
						</div>
					</div>
					<div className="flex flex-col w-[49%] outline outline-primary shadow-2xl rounded">
						<div className="flex justify-center w-full bg-primary py-2">
							<article className="text-primary-content font-semibold">{`Total (${selectedYear}) - Gender distribution of deaths`}</article>
						</div>
						<div className="flex w-full justify-center p-4">
							<PieChart
								data={graphData.genderDist}
								categoryKey={"gender"}
								valueKey={"mortalityRate"}
								width={width / 1.75}
								height={400}
							/>
						</div>
					</div>
				</div>
			</div>
			{/* footer */}
			<div className="h-8" />
		</div>
	)
}

export default SummaryPage
