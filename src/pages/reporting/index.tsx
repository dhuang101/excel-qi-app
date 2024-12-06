import reportReducer, { ACTION } from "@/reducers/reportReducer"
import { CircularProgress } from "@mui/material"
import axios from "axios"
import { useEffect, useReducer } from "react"
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts"

function ReportingPage() {
	const [state, dispatch] = useReducer(reportReducer, null)

	useEffect(() => {
		axios.get("/api/database/getSummary").then((result) => {
			dispatch({ type: ACTION.SET_SUMMARY, payload: result.data })
		})
	}, [])

	useEffect(() => {
		console.log(state)
	}, [state])

	return (
		<div className="flex flex-col flex-grow w-full items-center">
			{state !== null ? (
				<div className="flex flex-col w-2/3 h-full items-center">
					<article className="my-4 text-xl font-semibold">
						There are currently {state.totalDocuments} patients
						enrolled in the NICE Data Project.
					</article>
					<div className="flex w-full h-96">
						<div className="w-full">
							<ResponsiveContainer
								width={"100%"}
								height={
									80 *
									state.attributes.outcm_hosp_discharge_loc
										.length
								}
								debounce={50}
							>
								<BarChart
									layout="vertical"
									data={
										state.attributes
											.outcm_hosp_discharge_loc
									}
									margin={{ left: 30, right: 10 }}
								>
									<CartesianGrid
										strokeDasharray="3 5"
										stroke="oklch(var(--bc))"
										horizontal={false}
									/>
									<XAxis
										type="number"
										stroke="oklch(var(--bc))"
									/>
									<YAxis
										dataKey="_id"
										type="category"
										stroke="oklch(var(--bc))"
									/>
									<Bar
										dataKey="count"
										fill="oklch(var(--p))"
										label={{
											fill: "oklch(var(--bc))",
											fontSize: 16,
											position: "right",
										}}
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>
			) : (
				<div className="flex flex-col justify-center items-center h-[83vh]">
					<CircularProgress size={80} />
					<article className="text-lg font-semibold pt-4">
						Creating Summary...
					</article>
				</div>
			)}
		</div>
	)
}

export default ReportingPage
