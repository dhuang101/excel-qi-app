import axios from "axios"
import Barplot from "@/components/reporting/Barplot"
import { Boxplot } from "@/components/reporting/boxplot/Boxplot"
import reportReducer, { ACTION } from "@/reducers/reportReducer"
import { CircularProgress } from "@mui/material"
import { useEffect, useReducer, useRef, useState } from "react"
function ReportingPage() {
	const [state, dispatch] = useReducer(reportReducer, null)
	const [width, setWidth] = useState(0)

	const graphContainer = useRef<HTMLDivElement>(null)

	// sequentially fetch the data
	// TODO: fetch them in parallel?
	useEffect(() => {
		let payload = {}
		axios
			.get("/api/database/getCounts")
			.then((result) => {
				payload = result.data
			})
			.then(() => {
				return Promise.resolve(axios.get("/api/database/getLosValues"))
			})
			.then((result) => {
				payload = { ...payload, losData: result.data }
			})
			.then(() => {
				dispatch({ type: ACTION.SET_SUMMARY, payload: payload })
			})
	}, [])

	// dynamically assigns width variable to create responsive d3 graphs
	useEffect(() => {
		if (!graphContainer.current) {
			return
		}

		const resizeObserver = new ResizeObserver(() => {
			if (graphContainer.current!.offsetWidth !== width) {
				setWidth(graphContainer.current!.offsetWidth)
			}
		})

		resizeObserver.observe(graphContainer.current)

		return function cleanup() {
			resizeObserver.disconnect()
		}
	}, [graphContainer.current, state])

	// useEffect(() => {
	// 	console.log(state)
	// }, [state])

	return (
		<div className="flex flex-col flex-grow w-full items-center">
			{state !== null ? (
				<div className="flex flex-col w-2/3 h-full items-center">
					<article className="my-4 text-xl font-semibold">
						There are currently {state.totalDocuments} patients
						enrolled in the NICE Data Project.
					</article>
					<div
						ref={graphContainer}
						className="flex flex-col w-full h-96"
					>
						<Barplot
							width={width}
							height={750}
							data={state.counts.outcm_hosp_discharge_loc}
						/>
						<Boxplot
							width={width}
							height={750}
							data={state.losData}
						/>
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
