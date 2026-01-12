import { useMemo } from "react"
import * as d3 from "d3"

const MARGIN = { top: 30, right: 30, bottom: 70, left: 70 }
const BAR_PADDING = 0.3

interface DataItem {
	ageRange: string
	value: number
}

interface VerticalBarplotProps {
	width: number
	height: number
	data: DataItem[]
}

export const VerticalBarplot = ({
	width,
	height,
	data,
}: VerticalBarplotProps) => {
	const boundsWidth = width - MARGIN.right - MARGIN.left
	const boundsHeight = height - MARGIN.top - MARGIN.bottom

	// Scales
	const xScale = useMemo(() => {
		return d3
			.scaleBand()
			.domain(data.map((d) => d.ageRange))
			.range([0, boundsWidth])
			.padding(BAR_PADDING)
	}, [data, boundsWidth])

	const yScale = useMemo(() => {
		const max = d3.max(data, (d) => d.value)
		return d3
			.scaleLinear()
			.domain([0, max || 10])
			.nice()
			.range([boundsHeight, 0])
	}, [data, boundsHeight])

	// Grid lines (Horizontal for a vertical bar plot)
	const grid = yScale
		.ticks(5)
		.slice(1)
		.map((value, i) => (
			<g key={i}>
				<line
					x1={0}
					x2={boundsWidth}
					y1={yScale(value)}
					y2={yScale(value)}
					stroke="var(--color-base-content)"
					opacity={0.2}
				/>
				<text
					x={-10}
					y={yScale(value)}
					textAnchor="end"
					alignmentBaseline="middle"
					fontSize={12}
					fill="var(--color-base-content)"
					opacity={0.8}
				>
					{value}
				</text>
			</g>
		))

	const allShapes = data.map((d, i) => {
		const x = xScale(d.ageRange)
		if (x === undefined) return null

		const barHeight = boundsHeight - yScale(d.value)

		return (
			<g key={i}>
				<rect
					x={x}
					y={yScale(d.value)}
					width={xScale.bandwidth()}
					height={barHeight}
					opacity={0.7}
					stroke="var(--color-base-content)"
					fill="var(--color-primary)"
					fillOpacity={0.5}
					strokeWidth={1}
					rx={1}
				/>
				{/* Value Label (Top of Bar) */}
				<text
					x={x + xScale.bandwidth() / 2}
					y={yScale(d.value) - 7}
					textAnchor="middle"
					fill="var(--color-base-content)"
					fontSize={12}
				>
					{d.value.toFixed(1)}%
				</text>
			</g>
		)
	})

	return (
		<svg width={width} height={height}>
			<g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
				{/* Grid and Axes */}
				{grid}

				{/* X-axis labels */}
				{data.map((d, i) => (
					<text
						key={`x-label-${i}`}
						x={(xScale(d.ageRange) ?? 0) + xScale.bandwidth() / 2}
						y={boundsHeight + 20}
						textAnchor="middle"
						fontSize={12}
						fill="var(--color-base-content)"
					>
						{d.ageRange}
					</text>
				))}

				{/* Bars and labels */}
				{allShapes}

				{/* X Axis Title */}
				<text
					x={boundsWidth / 2}
					y={boundsHeight + 50}
					textAnchor="middle"
					fontSize={14}
					fill="var(--color-base-content)"
					fontWeight="bold"
				>
					Age Group
				</text>

				{/* Y Axis Title */}
				<text
					transform="rotate(-90)"
					x={-boundsHeight / 2}
					y={-50}
					textAnchor="middle"
					fontSize={14}
					fill="var(--color-base-content)"
					fontWeight="bold"
				>
					Mortality Rate
				</text>
			</g>
		</svg>
	)
}

export default VerticalBarplot
