import { ReportReducer } from "@/reducers/reportReducer"
import { GraphType } from "@/types/reportingTypes"
import React, { useState } from "react"

type PropType = { state: ReportReducer; displayedSite: string }

function ComparisonView({ state, displayedSite }: PropType) {
	const [displayedGraph, setDisplayedGraph] =
		useState<GraphType>("Hospital Outcomes")

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
			Comparison View
		</React.Fragment>
	)
}

export default ComparisonView
