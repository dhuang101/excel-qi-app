import { useMemo } from "react"
import * as d3 from "d3"

const MARGIN = { top: 30, right: 30, bottom: 70, left: 140 }
const BAR_PADDING = 0.3

interface BarplotProps {
	width: number
	height: number
	data: { value: string; count: number }[]
}

const SvgWrapText = (
	textElement: d3.Selection<SVGTextElement, unknown, null, undefined>,
	width: number
): void => {
	const lineHeight = 1.1
	const x = textElement.attr("x")
	const y = textElement.attr("y")

	let textContent = textElement.attr("data-original-text")
	if (!textContent) {
		textContent = textElement.text()
		textElement.attr("data-original-text", textContent)
	}

	textElement.text(null)
	const words = textContent.split(/\s+/).reverse()
	let word: string | undefined
	let line: string[] = []
	let lineNumber = 0

	let tspan = textElement.append("tspan").attr("x", x).attr("y", y)

	while ((word = words.pop())) {
		line.push(word)
		tspan.text(line.join(" "))
		if (
			(tspan.node()?.getComputedTextLength() ?? 0) > width &&
			line.length > 1
		) {
			line.pop()
			tspan.text(line.join(" "))
			line = [word]
			tspan = textElement
				.append("tspan")
				.attr("x", x)
				.attr("y", y)
				.text(word)
			lineNumber++
		}
	}

	const totalLines = textElement.selectAll("tspan").size()
	const bias = (totalLines - 1) / 2

	textElement.selectAll("tspan").attr("dy", (d, i) => {
		return (i - bias) * lineHeight + "em"
	})
}

export const Barplot = ({ width, height, data }: BarplotProps) => {
	const boundsWidth = width - MARGIN.right - MARGIN.left
	const boundsHeight = height - MARGIN.top - MARGIN.bottom

	const sortedData = useMemo(() => {
		return [...data].sort((a, b) => b.count - a.count)
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

		const availableWidthForLabel = MARGIN.left - 20

		return (
			<g key={i}>
				<rect
					x={xScale(0)}
					y={y}
					width={xScale(d.count)}
					height={yScale.bandwidth()}
					opacity={0.7}
					stroke="var(--color-base-content)"
					fill="var(--color-primary)"
					fillOpacity={0.5}
					strokeWidth={1}
					rx={1}
				/>
				{/* Count Label (End of Bar) */}
				<text
					x={
						xScale(d.count) > 30
							? xScale(d.count) - 7
							: xScale(d.count) + 12
					}
					y={y + yScale.bandwidth() / 2}
					textAnchor={xScale(d.count) > 30 ? "end" : "start"}
					dominantBaseline="middle"
					fill="var(--color-base-content)"
					fontSize={12}
				>
					{d.count}
				</text>
				{/* Y-Axis Wrapped Label */}
				<text
					x={xScale(0) - 10}
					y={y + yScale.bandwidth() / 2}
					textAnchor="end"
					fill="var(--color-base-content)"
					fontSize={12}
					ref={(node: SVGTextElement) => {
						if (node) {
							SvgWrapText(d3.select(node), availableWidthForLabel)
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
				<line
					x1={xScale(value)}
					x2={xScale(value)}
					y1={0}
					y2={boundsHeight}
					stroke="var(--color-base-content)"
					opacity={0.2}
				/>
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

export default Barplot
