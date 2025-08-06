import { CountEntry, LosStats, ReportReducer } from "@/reducers/reportReducer"
import Barplot from "./Barplot"
import { Boxplot } from "./boxplot/Boxplot"

type PropType = {
	state: ReportReducer
	displayedGraph: string
	displayedSite: string
	width: number
	height: number
}

function GraphRenderer({
	state,
	displayedGraph,
	displayedSite,
	width,
	height,
}: PropType) {
	switch (displayedGraph) {
		case "Hospital Outcomes":
			return (
				<div className="flex items-center flex-col">
					<article className="font-semibold">
						Hospital Outcomes
					</article>
					<Barplot
						width={width}
						height={height}
						data={
							state.countData.find(
								(site) => site.site === displayedSite
							)?.counts.outcm_hosp_discharge_loc as CountEntry[]
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
						width={width}
						height={height}
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
						width={width}
						height={height}
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
						width={width}
						height={height}
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

export default GraphRenderer
