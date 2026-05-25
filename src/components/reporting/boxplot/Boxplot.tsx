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

interface TooltipState {
	stats: BoxplotStats
	x: number
	y: number
}

export const Boxplot = ({ width, height, data }: BoxplotProps) => {
	const [tooltip, setTooltip] = useState<TooltipState | null>(null)

	const boundsWidth = width - MARGIN.right - MARGIN.left
	const boundsHeight = height - MARGIN.top - MARGIN.bottom

	// Compute chart boundaries safely
	const { chartMin, chartMax, groups } = useMemo(() => {
		const [currentMin, currentMax] = data.reduce(
			([cMin, cMax], d) => {
				// If outliers exist, they might be smaller than min or larger than max
				const localMin = d.outliers?.length
					? Math.min(d.min, ...d.outliers)
					: d.min
				const localMax = d.outliers?.length
					? Math.max(d.max, ...d.outliers)
					: d.max
				return [Math.min(cMin, localMin), Math.max(cMax, localMax)]
			},
			[Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
		)
		const groups = [...new Set(data.map((d) => d.name))]
		return { chartMin: currentMin, chartMax: currentMax, groups }
	}, [data])

	const xScale = d3
		.scaleLinear()
		.domain([chartMin, chartMax])
		.range([0, boundsWidth])
		.nice() // Prevents outliers from touching the absolute edge of the SVG

	const yScale = d3
		.scaleBand()
		.range([0, boundsHeight])
		.domain(groups)
		.padding(0.25)

	const allShapes = groups.map((group, i) => {
		const stats = data.find((d) => d.name === group) as BoxplotStats
		const { min, q1, median, q3, max, outliers = [] } = stats // Default to empty array if missing
		const bandHeight = yScale.bandwidth()

		return (
			<g
				key={i}
				transform={`translate(0,${yScale(group)})`}
				onMouseMove={(e) => {
					const containerBounds = e.currentTarget
						.closest(".relative-chart-container")
						?.getBoundingClientRect()
					setTooltip({
						stats,
						x: e.clientX - (containerBounds?.left || 0),
						y: e.clientY - (containerBounds?.top || 0) - 10,
					})
				}}
				onMouseLeave={() => setTooltip(null)}
				style={{ cursor: "pointer" }}
			>
				<HorizontalBox
					height={bandHeight}
					q1={xScale(q1)}
					median={xScale(median)}
					q3={xScale(q3)}
					min={xScale(min)}
					max={xScale(max)}
					stroke="var(--color-base-content)"
					fill={"var(--color-primary)"}
					fillOpacity={1}
				/>

				{/* Plot outliers if they exist in the dataset */}
				{outliers.map((value, idx) => (
					<circle
						key={idx}
						cx={xScale(value)}
						cy={bandHeight / 2} // Centers the dot vertically within the box channel
						r={4}
						fill="var(--color-error, #ef4444)"
						stroke="var(--color-base-content)"
						strokeWidth={1}
						opacity={0.8}
					/>
				))}
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
					}}
				>
					<strong>{tooltip.stats.name}</strong>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "auto auto",
							gap: "2px 10px",
						}}
					>
						<span>Max (Whisker):</span>{" "}
						<span>{tooltip.stats.max}</span>
						<span>Q3:</span> <span>{tooltip.stats.q3}</span>
						<span>Median:</span> <span>{tooltip.stats.median}</span>
						<span>Q1:</span> <span>{tooltip.stats.q1}</span>
						<span>Min (Whisker):</span>{" "}
						<span>{tooltip.stats.min}</span>
						{tooltip.stats.outliers &&
							tooltip.stats.outliers.length > 0 && (
								<span style={{ color: "#f87171" }}>
									Outliers: {tooltip.stats.outliers.length}{" "}
									pts
								</span>
							)}
					</div>
				</div>
			)}
		</div>
	)
}
