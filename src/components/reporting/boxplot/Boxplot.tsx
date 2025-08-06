import { useMemo } from "react"
import * as d3 from "d3"
import { AxisLeft } from "./AxisLeftCategoric"

import { HorizontalBox } from "./HorizontalBox"
import { AxisBottom } from "./AxisBottom"
import { LosStats } from "@/reducers/reportReducer"

const MARGIN = { top: 30, right: 30, bottom: 70, left: 120 }

interface BoxplotProps {
	width: number
	height: number
	data: LosStats[]
}

export const Boxplot = ({ width, height, data }: BoxplotProps) => {
	// The bounds (= area inside the axis) is calculated by substracting the margins from total width / height
	const boundsWidth = width - MARGIN.right - MARGIN.left
	const boundsHeight = height - MARGIN.top - MARGIN.bottom

	// Compute everything derived from the dataset:
	const { chartMin, chartMax, groups } = useMemo(() => {
		const [chartMin, chartMax] = data.reduce(
			([currentMin, currentMax], { min, max }) => [
				Math.min(currentMin, min),
				Math.max(currentMax, max),
			],
			[Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
		)
		const groups = [...new Set(data.map((d) => d.name))]
		return { chartMin, chartMax, groups }
	}, [data])

	// Compute scales
	const xScale = d3
		.scaleLinear()
		.domain([chartMin, chartMax])
		.range([0, boundsWidth])

	const yScale = d3
		.scaleBand()
		.range([0, boundsHeight])
		.domain(groups)
		.padding(0.25)

	// Build the box shapes
	const allShapes = groups.map((group, i) => {
		const { min, q1, median, q3, max } = data.find(
			(d) => d.name === group
		) as LosStats

		return (
			<g key={i} transform={`translate(0,${yScale(group)})`}>
				<HorizontalBox
					height={yScale.bandwidth()}
					q1={xScale(q1)}
					median={xScale(median)}
					q3={xScale(q3)}
					min={xScale(min)}
					max={xScale(max)}
					stroke="var(--color-base-content)"
					fill={"var(--color-primary)"}
					fillOpacity={0.5}
				/>
			</g>
		)
	})

	return (
		<div>
			<svg width={width} height={height}>
				<g
					width={boundsWidth}
					height={boundsHeight}
					transform={`translate(${[MARGIN.left, MARGIN.top].join(
						","
					)})`}
				>
					{allShapes}

					<AxisLeft yScale={yScale} />

					{/* X axis uses an additional translation to appear at the bottom */}
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
		</div>
	)
}
