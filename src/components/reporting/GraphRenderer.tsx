import {
	CountEntry,
	BoxplotStats,
	ReportReducer,
} from "@/reducers/reportReducer"
import HorizontalBarplot from "./HorizontalBarplot"
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
					<HorizontalBarplot
						width={width}
						height={height}
						data={
							state.countData.find(
								(site) => site.site === displayedSite,
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
					<HorizontalBarplot
						width={width}
						height={height}
						data={
							state.countData.find(
								(site) => site.site === displayedSite,
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
					<HorizontalBarplot
						width={width}
						height={height}
						data={
							state.countData.find(
								(site) => site.site === displayedSite,
							)?.counts.diagnosis_resp as CountEntry[]
						}
					/>
				</div>
			)
		case "ECMO Mode":
			return (
				<div className="flex items-center flex-col">
					<article className="font-semibold">ECMO Mode</article>
					<HorizontalBarplot
						width={width}
						height={height}
						data={
							state.countData.find(
								(site) => site.site === displayedSite,
							)?.counts.ecmo_mode as CountEntry[]
						}
					/>
				</div>
			)
		case "ECMO Indication":
			return (
				<div className="flex items-center flex-col">
					<article className="font-semibold">ECMO Indication</article>
					<HorizontalBarplot
						width={width}
						height={height}
						data={
							state.countData.find(
								(site) => site.site === displayedSite,
							)?.counts.ecmo_indication as CountEntry[]
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
							state.boxplotData
								.find((site) => site.site === displayedSite)
								?.stats.filter(
									(obj) => obj.name !== "outcm_mv_days_2",
								) as BoxplotStats[]
						}
					/>
				</div>
			)
		case "IMV Duration":
			return (
				<div className="flex items-center flex-col">
					<article className="font-semibold">IMV Duration</article>
					<Boxplot
						width={width}
						height={height}
						data={
							state.boxplotData
								.find((site) => site.site === displayedSite)
								?.stats.filter(
									(obj) => obj.name === "outcm_mv_days_2",
								) as BoxplotStats[]
						}
					/>
				</div>
			)
		case "Complications":
			return (
				<div className="flex items-center flex-col">
					<article className="font-semibold">Complications</article>
					<HorizontalBarplot
						width={width}
						height={height}
						data={
							state.countData.find(
								(site) => site.site === displayedSite,
							)?.counts.ards_outcomes as CountEntry[]
						}
					/>
				</div>
			)
	}
}

export default GraphRenderer
