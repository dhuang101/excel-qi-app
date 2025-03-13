import React, { useRef, useEffect } from "react"
import * as d3 from "d3"
import SvgImageDownload from "@/utilities/SvgImageDownload"

type ClusteredBarplotProps = {
	data: { category: string; [key: string]: number | string }[]
	keys: any[]
	width?: number
	height?: number
	margin?: { top: number; right: number; bottom: number; left: number }
}

const ClusteredBarplot: React.FC<ClusteredBarplotProps> = ({
	data,
	keys,
	width = 1400,
	height = 600,
	margin = { top: 50, right: 200, bottom: 100, left: 50 },
}) => {
	const svgRef = useRef<SVGSVGElement | null>(null)

	function handleDownload() {
		SvgImageDownload(svgRef, "clustered-barplot.jpg")
	}

	useEffect(() => {
		const svg = d3.select(svgRef.current)
		svg.selectAll("*").remove() // Clear previous content

		// Set up dimensions
		const chartWidth = width - margin.left - margin.right
		const chartHeight = height - margin.top - margin.bottom

		// Create scales
		const x0 = d3
			.scaleBand()
			.domain(data.map((d) => d.category))
			.range([0, chartWidth])
			.padding(0.2)

		const x1 = d3
			.scaleBand()
			.domain(keys)
			.range([0, x0.bandwidth()])
			.padding(0.1)

		const y = d3
			.scaleLinear()
			.domain([
				0,
				d3.max(data, (d) => d3.max(keys, (key) => d[key] as number)) ||
					0,
			])
			.nice()
			.range([chartHeight, 0])

		// Set up colors
		const color = d3
			.scaleOrdinal<string>()
			.domain(keys)
			.range(d3.schemeObservable10)

		// Create axes
		const xAxis = d3.axisBottom(x0)
		const yAxis = d3.axisLeft(y)

		// Append group for chart
		const chartGroup = svg
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`)

		// Add x-axis
		chartGroup
			.append("g")
			.attr("transform", `translate(0,${chartHeight})`)
			.call(xAxis)
			.selectAll("text")
			.attr("font-size", "12px")
			.attr("fill", "var(--color-base-content)")
			.attr("text-anchor", "middle")
			.call(wrapText, 80)

		// Function to wrap text
		function wrapText(
			text: d3.Selection<d3.BaseType, unknown, SVGGElement, unknown>, // Use BaseType for broader compatibility
			width: number
		): void {
			text.each(function () {
				const textElement = d3.select<SVGTextElement, unknown>(
					this as SVGTextElement
				) // Assert `this` as SVGTextElement
				const words: string[] = textElement.text().split(/\s+/) // Split text into words
				let line: string[] = []
				const lineHeight = 1.1 // Line height for wrapping
				const y: string | null = textElement.attr("y")
				let dy: number = parseFloat(textElement.attr("dy") || "0")

				// Clear the existing text and append the first tspan
				let tspan = textElement
					.text(null)
					.append("tspan")
					.attr("x", 0)
					.attr("y", y)
					.attr("dy", `${dy}em`)

				words.forEach((word) => {
					line.push(word)
					tspan.text(line.join(" "))

					const tspanNode = tspan.node() // Safely get the DOM node
					if (
						tspanNode &&
						tspanNode.getComputedTextLength() > width
					) {
						line.pop() // Remove the word that caused the overflow
						tspan.text(line.join(" ")) // Set the text for the current line
						line = [word] // Start a new line with the overflow word
						tspan = textElement
							.append("tspan")
							.attr("x", 0)
							.attr("y", y)
							.attr("dy", `${++dy * lineHeight}em`) // Move the new line downward
							.text(word)
					}
				})
			})
		}

		// Add y-axis
		chartGroup
			.append("g")
			.call(yAxis)
			.selectAll("text")
			.attr("font-size", "12px")
			.attr("fill", "var(--color-base-content)")

		// Add bars
		const bars = chartGroup
			.selectAll(".category-group")
			.data(data)
			.enter()
			.append("g")
			.attr("class", "category-group")
			.attr("transform", (d) => `translate(${x0(d.category)},0)`)

		bars.selectAll("rect")
			.data((d) => keys.map((key) => ({ key, value: d[key] as number })))
			.enter()
			.append("rect")
			.attr("x", (d) => x1(d.key) || 0)
			.attr("y", (d) => y(d.value))
			.attr("width", x1.bandwidth())
			.attr("height", (d) => (y(d.value) ? chartHeight - y(d.value) : 0))
			.attr("stroke", "var(--color-base-content)")
			.attr("stroke-width", "1")
			.attr("fill", (d) => color(d.key) || "#000")
			.attr("fill-opacity", "0.6")

		// Add labels for the x-axis
		svg.append("text")
			.attr("class", "x-axis-label")
			.attr("x", width / 2)
			.attr("y", height - 5)
			.attr("text-anchor", "middle")
			.attr("fill", "var(--color-base-content)")
			.text("Primary Diagnosis")

		// Add labels for the y-axis
		svg.append("text")
			.attr("class", "y-axis-label")
			.attr("x", -(height / 2))
			.attr("y", 15)
			.attr("transform", "rotate(-90)")
			.attr("fill", "var(--color-base-content)")
			.attr("text-anchor", "middle")
			.text("Count")

		// Add legend
		const legend = svg
			.append("g")
			.attr("class", "legend")
			.attr(
				"transform",
				`translate(${width - margin.right + 20}, ${margin.top})`
			)

		keys.forEach((key, i) => {
			const legendGroup = legend
				.append("g")
				.attr("transform", `translate(0, ${i * 20})`)

			legendGroup
				.append("rect")
				.attr("x", 0)
				.attr("y", 0)
				.attr("width", 15)
				.attr("height", 15)
				.attr("fill", color(key) || "#000")

			legendGroup
				.append("text")
				.attr("x", 20)
				.attr("y", 12)
				.attr("font-size", "12px")
				.attr("fill", "var(--color-base-content)")
				.text(key)
		})
	}, [data, keys, width, height, margin])

	return (
		<div className="flex flex-col items-center">
			<svg ref={svgRef}></svg>
			<button onClick={handleDownload} className="btn btn-primary mt-4">
				Download Plot
			</button>
		</div>
	)
}

export default ClusteredBarplot
