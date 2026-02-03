import { useMemo } from "react"
import * as d3 from "d3"
import { SvgWrapText } from "@/utilities/SvgWrapText"

const MARGIN = { top: 30, right: 30, bottom: 70, left: 200 }
const BAR_PADDING = 0.3

interface HorizontalBarplotProps {
	width: number
	height: number
	data: { value: string; count: number }[]
}

export const HorizontalBarplot = ({
	width,
	height,
	data,
}: HorizontalBarplotProps) => {
	const boundsWidth = width - MARGIN.right - MARGIN.left
	const boundsHeight = height - MARGIN.top - MARGIN.bottom

	const totalCount = useMemo(() => {
		return d3.sum(data, (d) => d.count)
	}, [data])

	const sortedData = useMemo(() => {
		return [...data]
			.filter((d) => d.count > 0)
			.sort((a, b) => b.count - a.count)
	}, [data])

	const groups = useMemo(() => sortedData.map((d) => d.value), [sortedData])

	const yScale = useMemo(() => {
		return d3
			.scaleBand()
			.domain(groups)
			.range([0, boundsHeight])
			.padding(BAR_PADDING)
	}, [groups, boundsHeight])

	const xScale = useMemo(() => {
		const max = d3.max(data, (d) => d.count)
		return d3
			.scaleLinear()
			.domain([0, max || 10])
			.range([0, boundsWidth])
	}, [data, boundsWidth])

	const allShapes = sortedData.map((d, i) => {
		const y = yScale(d.value)
		if (y === undefined) return null

		const availableWidthForLabel = MARGIN.left - 30

		const barWidth = xScale(d.count)
		const barCenterY = y + yScale.bandwidth() / 2

		const percentage =
			totalCount > 0 ? ((d.count / totalCount) * 100).toFixed(1) : 0

		return (
			<g key={i}>
				<rect
					x={xScale(0)}
					y={y}
					width={barWidth}
					height={yScale.bandwidth()}
					opacity={1}
					stroke="var(--color-base-content)"
					fill="var(--color-primary)"
					fillOpacity={1}
					strokeWidth={1}
					rx={1}
				/>
				<text
					x={
						xScale(d.count) > 60
							? xScale(d.count) - 7
							: xScale(d.count) + 12
					}
					y={barCenterY + 1}
					textAnchor={xScale(d.count) > 60 ? "end" : "start"}
					dominantBaseline="middle"
					fill="var(--color-base-content)"
					fontSize={12}
				>
					{`${d.count} (${percentage}%)`}
				</text>

				{/* Y-Axis Wrapped Label */}
				<text
					x={xScale(0) - 10}
					y={barCenterY + 4}
					textAnchor="end"
					fill="var(--color-base-content)"
					fontSize={12}
					ref={(node: SVGTextElement) => {
						if (node) {
							SvgWrapText(
								d3.select(node),
								availableWidthForLabel,
								d.value,
							)
						}
					}}
				>
					{d.value}
				</text>
			</g>
		)
	})

	const grid = xScale
		.ticks(Math.floor(width / 80))
		.slice(1)
		.map((value, i) => (
			<g key={i}>
				<text
					x={xScale(value)}
					y={boundsHeight + 12}
					textAnchor="middle"
					alignmentBaseline="central"
					fontSize={12}
					fill="var(--color-base-content)"
					opacity={0.8}
				>
					{value}
				</text>
			</g>
		))

	return (
		<svg width={width} height={height}>
			<g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
				{grid}
				{allShapes}
				<text
					x={boundsWidth / 2}
					y={boundsHeight + 50}
					textAnchor="middle"
					fontSize={14}
					fill="var(--color-base-content)"
					fontWeight="bold"
				>
					Patient Count
				</text>
			</g>
		</svg>
	)
}

export default HorizontalBarplot
