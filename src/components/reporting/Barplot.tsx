import { useMemo } from "react"
import * as d3 from "d3"

const MARGIN = { top: 30, right: 30, bottom: 30, left: 140 }
const BAR_PADDING = 0.3

type BarplotProps = {
	width: number
	height: number
	data: { _id: string; count: number }[]
}

export const Barplot = ({ width, height, data }: BarplotProps) => {
	// bounds = area inside the graph axis = calculated by substracting the margins
	const boundsWidth = width - MARGIN.right - MARGIN.left
	const boundsHeight = height - MARGIN.top - MARGIN.bottom

	// Y axis is for groups since the barplot is horizontal
	const groups = data.sort((a, b) => b.count - a.count).map((d) => d._id)
	const yScale = useMemo(() => {
		return d3
			.scaleBand()
			.domain(groups)
			.range([0, boundsHeight])
			.padding(BAR_PADDING)
	}, [data, height])

	// X axis
	const xScale = useMemo(() => {
		const [min, max] = d3.extent(data.map((d) => d.count))
		return d3
			.scaleLinear()
			.domain([0, max || 10])
			.range([0, boundsWidth])
	}, [data, width])

	// Build the shapes
	const wrapText = (
		textElement: d3.Selection<SVGTextElement, any, null, undefined>,
		width: number
	): void => {
		const text = textElement
		const words = text.text().split(/\s+/) // Split the text into words
		let word
		const line: string[] = []
		const lineHeight = 1.1 // Line height multiplier
		const x = text.attr("x")
		const y = text.attr("y")
		let dy = parseFloat(text.attr("dy") || "0")

		// Only wrap text if it hasn't been wrapped already
		if (text.selectAll("tspan").size() > 0) return // Exit if wrapping has already been done

		// Start with the first tspan element
		let tspan = text
			.text(null)
			.append("tspan")
			.attr("x", x)
			.attr("y", y)
			.attr("dy", dy + "em")

		while ((word = words.shift())) {
			// Shift words from the front of the array
			line.push(word)
			tspan.text(line.join(" "))

			// Safely check the computed text length
			const computedTextLength =
				tspan.node()?.getComputedTextLength() ?? 0

			// Check if the current tspan width exceeds the allowed width
			if (computedTextLength > width) {
				// If it does, remove the last word and start a new tspan line
				line.pop()
				tspan.text(line.join(" "))
				line.length = 0
				line.push(word) // Push the current word to start a new line
				tspan = text
					.append("tspan")
					.attr("x", x)
					.attr("y", y)
					.attr("dy", ++dy * lineHeight + "em")
					.text(word)
			}
		}
	}

	const allShapes = data.map((d, i) => {
		const y = yScale(d._id)
		if (y === undefined) {
			return null
		}

		return (
			<g key={i}>
				<rect
					x={xScale(0)}
					y={yScale(d._id)}
					width={xScale(d.count)}
					height={yScale.bandwidth()}
					opacity={0.7}
					stroke="oklch(var(--bc))"
					fill="oklch(var(--p))"
					fillOpacity={0.5}
					strokeWidth={1}
					rx={1}
				/>
				<text
					x={xScale(d.count) - 7}
					y={y + yScale.bandwidth() / 2}
					textAnchor="end"
					alignmentBaseline="central"
					fill="oklch(var(--bc))"
					fontSize={12}
					opacity={xScale(d.count) > 90 ? 1 : 0} // hide label if bar is not wide enough
				>
					{d.count}
				</text>
				<text
					x={xScale(0) - 8}
					y={y + yScale.bandwidth() / 2}
					textAnchor="end"
					fill="oklch(var(--bc))"
					alignmentBaseline="central"
					fontSize={12}
					ref={(node: SVGTextElement) => {
						// Use the wrapText function to wrap the text
						if (node) {
							const textElement = d3.select(node)
							wrapText(textElement, xScale(0) + 128) // Wrap the text to fit within the available width
						}
					}}
				>
					{d._id}
				</text>
			</g>
		)
	})

	const grid = xScale
		.ticks(5)
		.slice(1)
		.map((value, i) => (
			<g key={i}>
				<line
					x1={xScale(value)}
					x2={xScale(value)}
					y1={0}
					y2={boundsHeight}
					stroke="oklch(var(--bc))"
					opacity={0.2}
				/>
				<text
					x={xScale(value)}
					y={boundsHeight + 12}
					textAnchor="middle"
					alignmentBaseline="central"
					fontSize={12}
					fill="oklch(var(--bc))"
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
				</g>
			</svg>
		</div>
	)
}

export default Barplot
