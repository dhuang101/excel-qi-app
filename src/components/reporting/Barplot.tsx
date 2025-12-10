import { useMemo } from "react"
import * as d3 from "d3"

const MARGIN = { top: 30, right: 30, bottom: 70, left: 140 }
const BAR_PADDING = 0.3

interface BarplotProps {
	width: number
	height: number
	data: { value: string; count: number }[]
}

export const Barplot = ({ width, height, data }: BarplotProps) => {
	const boundsWidth = width - MARGIN.right - MARGIN.left
	const boundsHeight = height - MARGIN.top - MARGIN.bottom

	// Y axis is for groups since the barplot is horizontal
	const groups = data.sort((a, b) => b.count - a.count).map((d) => d.value)
	const yScale = useMemo(() => {
		return d3
			.scaleBand()
			.domain(groups)
			.range([0, boundsHeight])
			.padding(BAR_PADDING)
		// disabled as d3 does not correctly handle dependencies
		// eslint-disable-next-line
	}, [data, height])

	// X axis
	const xScale = useMemo(() => {
		const [min, max] = d3.extent(data.map((d) => d.count))
		return d3
			.scaleLinear()
			.domain([0, max || 10])
			.range([0, boundsWidth])
		// disabled as d3 does not correctly handle dependencies
		// eslint-disable-next-line
	}, [data, width])

	const SvgWrapText = (textElement: any, width: number): void => {
		const text = textElement
		const originalText = text.attr("data-original-text")
		if (originalText) {
			text.text(originalText)
			text.selectAll("tspan").remove()
		}

		const words = text.text().split(/\s+/)
		let word
		const line: string[] = []
		const lineHeight = 1.1
		const x = text.attr("x")
		const y = text.attr("y")
		let dy = parseFloat(text.attr("dy") || "0")

		// Start with the first tspan element
		let tspan = text
			.text(null)
			.append("tspan")
			.attr("x", x)
			.attr("y", y)
			.attr("dy", dy + "em")

		while ((word = words.shift())) {
			line.push(word)
			tspan.text(line.join(" "))

			const computedTextLength =
				tspan.node()?.getComputedTextLength() ?? 0

			if (computedTextLength > width) {
				line.pop()
				tspan.text(line.join(" "))
				line.length = 0
				line.push(word)
				tspan = text
					.append("tspan")
					.attr("x", x)
					.attr("y", y)
					.attr("dy", ++dy * lineHeight + "em")
					.text(word)
			}
		}
	}

	// Build the shapes
	const allShapes = data.map((d, i) => {
		const y = yScale(d.value)
		if (y === undefined) {
			return null
		}

		// Available space for the Y-axis label (d.value)
		const availableWidthForLabel = 128
		const labelText = d.value

		return (
			<g key={i}>
				<rect
					x={xScale(0)}
					y={yScale(d.value)}
					width={xScale(d.count)}
					height={yScale.bandwidth()}
					opacity={0.7}
					stroke="var(--color-base-content)"
					fill="var(--color-primary)"
					fillOpacity={0.5}
					strokeWidth={1}
					rx={1}
				/>
				<text
					x={
						xScale(d.count) > 30
							? xScale(d.count) - 7
							: xScale(d.count) + 12
					}
					y={y + yScale.bandwidth() / 2}
					textAnchor="end"
					alignmentBaseline="central"
					fill="var(--color-base-content)"
					fontSize={12}
					opacity={1}
				>
					{d.count}
				</text>
				<text
					x={xScale(0) - 8}
					y={y + yScale.bandwidth() / 2}
					textAnchor="end"
					fill="var(--color-base-content)"
					alignmentBaseline="central"
					fontSize={12}
					data-original-text={labelText}
					ref={(node: SVGTextElement) => {
						// Use the wrapText function to wrap the text
						if (node) {
							const textElement = d3.select(node)
							SvgWrapText(textElement, availableWidthForLabel)
						}
					}}
				>
					{labelText}
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
		<div>
			<svg width={width} height={height}>
				<g
					width={boundsWidth}
					height={boundsHeight}
					transform={`translate(${[MARGIN.left, MARGIN.top].join(
						","
					)})`}
				>
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
		</div>
	)
}

export default Barplot
