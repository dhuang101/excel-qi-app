import { CountEntry, LosStats, ReportReducer } from "@/reducers/reportReducer"
import { GraphType } from "@/types/reportingTypes"
import React, { useEffect, useRef, useState } from "react"
import Barplot from "./Barplot"
import { Boxplot } from "./boxplot/Boxplot"
import { FormatSiteName } from "@/utilities/FormatSiteName"

type PropType = { state: ReportReducer }

function ComparisonView({ state }: PropType) {
	const [displayedSite, setDisplayedSite] = useState<string>("all_sites")
	const [displayedGraph, setDisplayedGraph] =
		useState<GraphType>("Hospital Outcomes")

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

	function renderGraph() {
		switch (displayedGraph) {
			case "Hospital Outcomes":
				return (
					<div className="flex items-center flex-col">
						<article className="font-semibold">
							Hospital Outcomes
						</article>
						<Barplot
							width={width / 2}
							height={600}
							data={
								state.countData.find(
									(site) => site.site === displayedSite
								)?.counts
									.outcm_hosp_discharge_loc as CountEntry[]
							}
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
							width={width / 2}
							height={600}
							data={
								state.countData.find(
									(site) => site.site === displayedSite
								)?.counts.diagnosis_cardiac as CountEntry[]
							}
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
							width={width / 2}
							height={600}
							data={
								state.countData.find(
									(site) => site.site === displayedSite
								)?.counts.diagnosis_resp as CountEntry[]
							}
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
							width={width / 2}
							height={600}
							data={
								state.losData.find(
									(site) => site.site === displayedSite
								)?.stats as LosStats[]
							}
						/>
					</div>
				)
		}
	}

	return (
		<React.Fragment>
			<div className="w-full">
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
						<option>Length of Stay Distribution</option>
					</select>
				</fieldset>
			</div>
			<div ref={graphContainer} className="flex mt-2 w-full">
				<div className="flex flex-col items-center">
					<fieldset className="fieldset w-1/2">
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
					{renderGraph()}
				</div>
				<div className="flex flex-col items-center">
					<fieldset className="fieldset w-1/2">
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
					{renderGraph()}
				</div>
			</div>
		</React.Fragment>
	)
}

export default ComparisonView
