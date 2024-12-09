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

	function updateDimensions() {
		console.log("t")
		setWidth(document.body.clientWidth)
	}

	useEffect(() => {
		// fetch summary
		axios.get("/api/database/getSummary").then((result) => {
			dispatch({ type: ACTION.SET_SUMMARY, payload: result.data })
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
	}, [graphContainer.current])

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
					<div ref={graphContainer} className="flex w-full h-96">
						<Barplot
							width={width / 2}
							height={750}
							data={state.attributes.outcm_hosp_discharge_loc}
						/>
						{/* <Boxplot width={width / 2} height={750} data={data} /> */}
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
