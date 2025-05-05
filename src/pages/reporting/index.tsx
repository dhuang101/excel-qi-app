import axios from "axios"
import Barplot from "@/components/reporting/Barplot"
import { Boxplot } from "@/components/reporting/boxplot/Boxplot"
import reportReducer, { ACTION } from "@/reducers/reportReducer"
import { CircularProgress } from "@mui/material"
import { useEffect, useReducer, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import qs from "qs"

type GraphType =
	| "Hospital Outcomes"
	| "Primary Cardiac Diagnosis"
	| "Primary Respiratory Diagnosis"
	| "Length of Stay Distribution"

function ReportingPage() {
	// auth session
	const { data: session, status } = useSession()
	// state
	const [state, dispatch] = useReducer(reportReducer, {
		totalDocuments: 0,
		counts: {},
		losData: [],
	})
	const [displayedGraph, setDisplayedGraph] =
		useState<GraphType>("Hospital Outcomes")
	const [width, setWidth] = useState(0)

	const graphContainer = useRef<HTMLDivElement | null>(null)

	// sequentially fetch the data
	// TODO: fetch them in parallel?
	useEffect(() => {
		if (status !== "authenticated") {
			return
		}

		let payload = {}
		axios
			.get("/api/database/getCounts", {
				params: {
					role: session?.user.role,
					sites: session?.user.sites,
				},
				paramsSerializer: (params) =>
					qs.stringify(params, { arrayFormat: "brackets" }),
			})
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
	}, [status])

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

	function renderGraph() {
		switch (displayedGraph) {
			case "Hospital Outcomes":
				return (
					<div className="flex items-center flex-col">
						<article className="font-semibold">
							Hospital Outcomes
						</article>
						<Barplot
							width={width}
							height={650}
							data={state.counts.outcm_hosp_discharge_loc}
						/>
					</div>
				)
			case "Primary Cardiac Diagnosis":
				return (
					<div className="flex items-center flex-col">
						<article className="font-semibold">
							Primary Cardiac Diagnosis
						</article>
						<Barplot
							width={width}
							height={650}
							data={state.counts.diagnosis_cardiac}
						/>
					</div>
				)
			case "Primary Respiratory Diagnosis":
				return (
					<div className="flex items-center flex-col">
						<article className="font-semibold">
							Primary Respiratory Diagnosis
						</article>
						<Barplot
							width={width}
							height={650}
							data={state.counts.diagnosis_resp}
						/>
					</div>
				)
			case "Length of Stay Distribution":
				return (
					<div className="flex items-center flex-col">
						<article className="font-semibold">
							Length of Stay Distribution
						</article>
						<Boxplot
							width={width}
							height={650}
							data={state.losData}
						/>
					</div>
				)
		}
	}

	return (
		<div className="flex flex-col grow w-full items-center">
			{state.totalDocuments > 0 ? (
				<div className="flex flex-col w-2/3 h-full items-center">
					<article className="my-4 text-xl font-semibold">
						There are currently {state.totalDocuments} patients
						enrolled in the NICE Data Project.
					</article>
					<div className="w-full">
						<fieldset className="fieldset">
							<legend className="fieldset-legend">
								Change Displayed Graph
							</legend>
							<select
								defaultValue="Hospital Outcomes"
								className="select"
								onChange={(event) => {
									setDisplayedGraph(
										event.target.value as GraphType
									)
								}}
							>
								<option>Hospital Outcomes</option>
								<option>Primary Cardiac Diagnosis</option>
								<option>Primary Respiratory Diagnosis</option>
								<option>Length of Stay Distribution</option>
							</select>
						</fieldset>
					</div>
					<div ref={graphContainer} className="flex flex-col w-full">
						{renderGraph()}
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
