import { useMemo, useState } from "react"
import * as d3 from "d3"
import { AxisLeft } from "./AxisLeftCategoric"

import { HorizontalBox } from "./HorizontalBox"
import { AxisBottom } from "./AxisBottom"
import { BoxplotStats } from "@/reducers/reportReducer"

const MARGIN = { top: 30, right: 30, bottom: 70, left: 120 }

interface BoxplotProps {
	width: number
	height: number
	data: BoxplotStats[]
}

const valueMap: { [index: string]: any } = {
	outcm_ecmo_days_2: "Days on ECMO",
	outcm_icu_days: "Days in ICU",
	outcm_hosp_days: "Days in Hospital",
	outcm_mv_days_2: "Days on IMV",
}

interface TooltipState {
	stats: BoxplotStats
	x: number
	y: number
}

export const Boxplot = ({ width, height, data }: BoxplotProps) => {
	const [tooltip, setTooltip] = useState<TooltipState | null>(null)

	const boundsWidth = width - MARGIN.right - MARGIN.left
	const boundsHeight = height - MARGIN.top - MARGIN.bottom

	const { chartMin, chartMax, groups } = useMemo(() => {
		const [chartMin, chartMax] = data.reduce(
			([currentMin, currentMax], { min, max }) => [
				Math.min(currentMin, min),
				Math.max(currentMax, max),
			],
			[Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
		)
		const groups = [...new Set(data.map((d) => d.name))]
		return { chartMin, chartMax, groups }
	}, [data])

	const xScale = d3
		.scaleLinear()
		.domain([chartMin, chartMax])
		.range([0, boundsWidth])

	const yScale = d3
		.scaleBand()
		.range([0, boundsHeight])
		.domain(groups)
		.padding(0.25)

	const allShapes = groups.map((group, i) => {
		const stats = data.find((d) => d.name === group) as BoxplotStats
		const { min, q1, median, q3, max } = stats

		return (
			<g
				key={i}
				transform={`translate(0,${yScale(group)})`}
				onMouseMove={(e) => {
					const bounds = e.currentTarget.getBoundingClientRect()
					const containerBounds = e.currentTarget
						.closest(".relative-chart-container")
						?.getBoundingClientRect()

					const x = e.clientX - (containerBounds?.left || 0)
					const y = e.clientY - (containerBounds?.top || 0)

					setTooltip({
						stats,
						x,
						y: y - 10,
					})
				}}
				onMouseLeave={() => setTooltip(null)}
				style={{ cursor: "pointer" }}
			>
				<HorizontalBox
					height={yScale.bandwidth()}
					q1={xScale(q1)}
					median={xScale(median)}
					q3={xScale(q3)}
					min={xScale(min)}
					max={xScale(max)}
					stroke="var(--color-base-content)"
					fill={"var(--color-primary)"}
					fillOpacity={1}
				/>
			</g>
		)
	})

	return (
		<div
			className="relative-chart-container"
			style={{ position: "relative", width }}
		>
			<svg width={width} height={height}>
				<g
					width={boundsWidth}
					height={boundsHeight}
					transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
				>
					{allShapes}

					<AxisLeft yScale={yScale} />

					<g transform={`translate(0, ${boundsHeight})`}>
						<AxisBottom
							xScale={xScale}
							height={boundsHeight}
							pixelsPerTick={40}
						/>
					</g>
					<text
						x={boundsWidth / 2}
						y={boundsHeight + 50}
						textAnchor="middle"
						fontSize={14}
						fill="var(--color-base-content)"
						fontWeight="bold"
					>
						Days
					</text>
				</g>
			</svg>

			{tooltip && (
				<div
					style={{
						position: "absolute",
						left: tooltip.x,
						top: tooltip.y,
						transform: "translate(-50%, -100%)",
						backgroundColor: "rgba(0, 0, 0, 0.85)",
						color: "#fff",
						padding: "8px 12px",
						borderRadius: "4px",
						fontSize: "12px",
						pointerEvents: "none",
						zIndex: 10,
						boxShadow: "0 4px 6px rgba(0,0,0,0.15)",
						lineHeight: "1.4",
					}}
				>
					<strong
						style={{
							display: "block",
							marginBottom: "4px",
							borderBottom: "1px solid #555",
						}}
					>
						{valueMap[tooltip.stats.name] || tooltip.stats.name}
					</strong>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "auto auto",
							gap: "2px 10px",
						}}
					>
						<span>Max:</span>{" "}
						<span style={{ textAlign: "right" }}>
							{tooltip.stats.max}
						</span>
						<span>Q3:</span>{" "}
						<span style={{ textAlign: "right" }}>
							{tooltip.stats.q3}
						</span>
						<span>Median:</span>{" "}
						<span
							style={{
								textAlign: "right",
								fontWeight: "bold",
								color: "#60a5fa",
							}}
						>
							{tooltip.stats.median}
						</span>
						<span>Q1:</span>{" "}
						<span style={{ textAlign: "right" }}>
							{tooltip.stats.q1}
						</span>
						<span>Min:</span>{" "}
						<span style={{ textAlign: "right" }}>
							{tooltip.stats.min}
						</span>
					</div>
				</div>
			)}
		</div>
	)
}
