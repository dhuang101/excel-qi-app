import { ReportReducer } from "@/reducers/reportReducer"
import React, { useEffect, useRef, useState } from "react"
import { GraphType } from "@/types/reportingTypes"
import { FormatName } from "@/utilities/FormatName"
import GraphRenderer from "./GraphRenderer"
import { useSession } from "next-auth/react"

type PropType = {
	state: ReportReducer
}

function SingleView({ state }: PropType) {
	// auth session
	const { status } = useSession()

	const [displayedGraph, setDisplayedGraph] =
		useState<GraphType>("Hospital Outcomes")
	const [displayedSite, setDisplayedSite] = useState<string>(
		state.countData.length > 1 ? state.countData[1].site : "all_sites"
	)
	const [width, setWidth] = useState(0)

	const graphContainer = useRef<HTMLDivElement | null>(null)

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

	return (
		<React.Fragment>
			<div className="flex justify-between w-full mt-2">
				<fieldset className="fieldset w-1/3">
					<legend className="fieldset-legend">
						Change Displayed Graph
					</legend>
					<select
						defaultValue="Hospital Outcomes"
						className="select"
						onChange={(event) => {
							setDisplayedGraph(event.target.value as GraphType)
						}}
					>
						<option>Hospital Outcomes</option>
						<option>Primary Cardiac Diagnosis</option>
						<option>Primary Respiratory Diagnosis</option>
						<option>ECMO Mode</option>
						<option>ECMO Indication</option>
						<option>Length of Stay Distribution</option>
					</select>
				</fieldset>
				{status === "authenticated" && (
					<fieldset className="fieldset w-1/3">
						<legend className="fieldset-legend">
							Select Site to Display
						</legend>
						<select
							defaultValue={
								state.countData.map((item) => item.site)[1]
							}
							className="select"
							onChange={(event) => {
								setDisplayedSite(event.target.value)
							}}
						>
							{state.countData.map((site) => (
								<option key={site.site} value={site.site}>
									{FormatName(site.site)}
								</option>
							))}
						</select>
					</fieldset>
				)}
			</div>
			<article className="xl:text-xl md:text-md font-semibold my-4">
				There are currently{" "}
				{
					state.countData.find((site) => site.site === displayedSite)
						?.totalDocuments
				}{" "}
				patients enrolled in the EXCEL QI Project at your site(s).
			</article>
			<div ref={graphContainer} className="flex flex-col w-full">
				<GraphRenderer
					state={state}
					displayedGraph={displayedGraph}
					displayedSite={displayedSite}
					width={width}
					height={625}
				/>
			</div>
		</React.Fragment>
	)
}

export default SingleView
