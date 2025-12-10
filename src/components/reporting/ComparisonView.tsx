import { ReportReducer } from "@/reducers/reportReducer"
import { GraphType } from "@/types/reportingTypes"
import React, { useEffect, useRef, useState } from "react"
import { FormatName } from "@/utilities/FormatName"
import GraphRenderer from "./GraphRenderer"

type PropType = { state: ReportReducer }

function ComparisonView({ state }: PropType) {
	const [displayedGraph, setDisplayedGraph] =
		useState<GraphType>("Hospital Outcomes")
	const [leftDisplayedSite, setLeftDisplayedSite] = useState<string>(
		state.countData.map((item) => item.site)[1]
	)
	const [rightDisplayedSite, setRightDisplayedSite] =
		useState<string>("all_sites")
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
			<div className="w-full mt-2">
				<fieldset className="fieldset  w-1/3">
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
			</div>
			<div
				ref={graphContainer}
				className="flex justify-between mt-2 w-full"
			>
				<div className="flex flex-col items-center">
					<fieldset className="fieldset w-1/2 mb-2">
						<legend className="fieldset-legend">
							Select Site to Display
						</legend>
						<select
							defaultValue={
								state.countData.map((item) => item.site)[1]
							}
							className="select"
							onChange={(event) => {
								setLeftDisplayedSite(event.target.value)
							}}
						>
							{state.countData.map((site) => (
								<option key={site.site} value={site.site}>
									{FormatName(site.site)}
								</option>
							))}
						</select>
					</fieldset>
					<GraphRenderer
						state={state}
						displayedGraph={displayedGraph}
						displayedSite={leftDisplayedSite}
						width={width / 2.2}
						height={600}
					/>
				</div>
				<div className="flex flex-col items-center">
					<fieldset className="fieldset w-1/2 mb-2">
						<legend className="fieldset-legend">
							Select Site to Display
						</legend>
						<select
							defaultValue="All Sites"
							className="select"
							onChange={(event) => {
								setRightDisplayedSite(event.target.value)
							}}
						>
							{state.countData.map((site) => (
								<option key={site.site} value={site.site}>
									{FormatName(site.site)}
								</option>
							))}
						</select>
					</fieldset>
					<GraphRenderer
						state={state}
						displayedGraph={displayedGraph}
						displayedSite={rightDisplayedSite}
						width={width / 2.2}
						height={600}
					/>
				</div>
			</div>
		</React.Fragment>
	)
}

export default ComparisonView
