import axios from "axios"
import Barplot from "@/components/reporting/Barplot"
import { Boxplot } from "@/components/reporting/boxplot/Boxplot"
import reportReducer, { ACTION } from "@/reducers/reportReducer"
import { CircularProgress } from "@mui/material"
import { useEffect, useReducer, useRef, useState } from "react"

function ReportingPage() {
	const [state, dispatch] = useReducer(reportReducer, null)
	const [width, setWidth] = useState(0)

	const graphContainer = useRef<HTMLDivElement | null>(null)

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
			if (
				graphContainer.current?.offsetWidth !== width &&
				graphContainer.current !== null
			) {
				setWidth(graphContainer.current!.offsetWidth)
			}
		})

		if (graphContainer.current) {
			resizeObserver.observe(graphContainer.current)
		}

		return () => {
			resizeObserver.disconnect()
		}
	}, [state, width])

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
					<div ref={graphContainer} className="flex flex-col w-full">
						<div className="flex mt-4 h-fit">
							<div className="flex items-center flex-col">
								<article className="font-semibold">
									Hospital Outcomes
								</article>
								<Barplot
									width={width / 3}
									height={650}
									data={state.counts.outcm_hosp_discharge_loc}
								/>
							</div>
							<div className="flex items-center flex-col">
								<article className="font-semibold">
									Primary Cardiac Diagnosis
								</article>
								<Barplot
									width={width / 3}
									height={650}
									data={state.counts.diagnosis_cardiac}
								/>
								<article className="mt-4">
									These figures display the number of patients
									for each unique value of the titled
									attribute
								</article>
							</div>
							<div className="flex items-center flex-col">
								<article className="font-semibold">
									Primary Respiratory Diagnosis
								</article>
								<Barplot
									width={width / 3}
									height={650}
									data={state.counts.diagnosis_resp}
								/>
							</div>
						</div>
						<div className="flex items-center flex-col mt-16">
							<article className="font-semibold">
								Length of Stay Distribution
							</article>
							<Boxplot
								width={width / 1.5}
								height={500}
								data={state.losData}
							/>
							<article className="mt-4 w-1/3">
								Boxplot detailing the distribution of length of
								stays in vital hospital locations
							</article>
						</div>
					</div>
					{/* footer */}
					<div className="h-16" />
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
