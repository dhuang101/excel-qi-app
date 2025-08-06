import { ReportReducer } from "@/reducers/reportReducer"
import React, { useEffect, useRef, useState } from "react"
import { GraphType } from "@/types/reportingTypes"
import { FormatSiteName } from "@/utilities/FormatSiteName"
import GraphRenderer from "./GraphRenderer"

type PropType = {
	state: ReportReducer
}

function SingleView({ state }: PropType) {
	const [displayedGraph, setDisplayedGraph] =
		useState<GraphType>("Hospital Outcomes")
	const [displayedSite, setDisplayedSite] = useState<string>("all_sites")
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
						<option>Length of Stay Distribution</option>
					</select>
				</fieldset>
				<fieldset className="fieldset w-1/3">
					<legend className="fieldset-legend">
						Select Site to Display
					</legend>
					<select
						defaultValue="All Sites"
						className="select"
						onChange={(event) => {
							setDisplayedSite(event.target.value)
						}}
					>
						{state.countData.map((site) => (
							<option key={site.site} value={site.site}>
								{FormatSiteName(site.site)}
							</option>
						))}
					</select>
				</fieldset>
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
