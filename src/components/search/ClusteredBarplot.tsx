import React, { useRef, useEffect } from "react"
import * as d3 from "d3"
import SvgImageDownload from "@/utilities/SvgImageDownload"

interface ClusteredBarplotProps {
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
	margin = { top: 50, right: 208, bottom: 100, left: 50 },
}) => {
	const svgRef = useRef<SVGSVGElement | null>(null)

	function handleDownload() {
		SvgImageDownload(svgRef, "clustered-barplot.jpg")
	}

	useEffect(() => {
		const svg = d3.select(svgRef.current)
		svg.selectAll("*").remove() // Clear previous content

		const chartWidth = width - margin.left - margin.right
		const chartHeight = height - margin.top - margin.bottom

		// Clean keys and data once
		const cleanKeys = keys.filter(
			(k) => k !== undefined && k !== "undefined"
		)
		const cleanData = data.filter(
			(d) =>
				d.category !== "N/A" &&
				d.category !== undefined &&
				d.category !== "undefined"
		)

		// Create scales
		const x0 = d3
			.scaleBand()
			.domain(cleanData.map((d) => d.category))
			.range([0, chartWidth])
			.padding(0.2)

		const x1 = d3
			.scaleBand()
			.domain(cleanKeys)
			.range([0, x0.bandwidth()])
			.padding(0.1)

		const y = d3
			.scaleLinear()
			.domain([
				0,
				d3.max(cleanData, (d) =>
					d3.max(cleanKeys, (key) => Number(d[key]) || 0)
				) || 0,
			])
			.nice()
			.range([chartHeight, 0])

		const color = d3
			.scaleOrdinal<string>()
			.domain(cleanKeys)
			.range(d3.schemeObservable10)

		const xAxis = d3.axisBottom(x0)
		const yAxis = d3.axisLeft(y)

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
			text: d3.Selection<d3.BaseType, unknown, SVGGElement, unknown>,
			width: number
		): void {
			text.each(function () {
				const textElement = d3.select<SVGTextElement, unknown>(
					this as SVGTextElement
				)
				const words: string[] = textElement.text().split(/\s+/)
				let line: string[] = []
				const lineHeight = 1.1
				const y: string | null = textElement.attr("y")
				let dy: number = parseFloat(textElement.attr("dy") || "0")

				let tspan = textElement
					.text(null)
					.append("tspan")
					.attr("x", 0)
					.attr("y", y)
					.attr("dy", `${dy}em`)

				words.forEach((word) => {
					line.push(word)
					tspan.text(line.join(" "))

					const tspanNode = tspan.node()
					if (
						tspanNode &&
						tspanNode.getComputedTextLength() > width
					) {
						line.pop()
						tspan.text(line.join(" "))
						line = [word]
						tspan = textElement
							.append("tspan")
							.attr("x", 0)
							.attr("y", y)
							.attr("dy", `${++dy * lineHeight}em`)
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

		// Add horizontal gridlines
		const grid = chartGroup
			.append("g")
			.attr("class", "gridlines")
			.call(
				d3
					.axisLeft(y)
					.tickSize(-chartWidth)
					.tickFormat(() => "")
			)

		grid.selectAll("line")
			.attr("stroke", "var(--color-base-content)")
			.attr("stroke-opacity", 0.2)

		// Remove the axis domain line so it doesn't sit on top
		grid.select(".domain").remove()

		// Add bars
		const bars = chartGroup
			.selectAll(".category-group")
			.data(cleanData)
			.enter()
			.append("g")
			.attr("class", "category-group")
			.attr("transform", (d) => `translate(${x0(d.category)},0)`)

		bars.selectAll("rect")
			.data((d) =>
				cleanKeys.map((key) => ({ key, value: Number(d[key]) || 0 }))
			)
			.enter()
			.append("rect")
			.attr("x", (d) => x1(d.key) || 0)
			.attr("y", (d) => y(d.value))
			.attr("width", x1.bandwidth())
			.attr("height", (d) => chartHeight - y(d.value))
			.attr("stroke", "var(--color-base-content)")
			.attr("stroke-width", "1")
			.attr("fill", (d) => color(d.key) || "#000")
			.attr("fill-opacity", "0.6")

		bars.selectAll(".bar-label")
			.data((d) => {
				const total = cleanKeys.reduce(
					(sum, key) => sum + (Number(d[key]) || 0),
					0
				)

				return cleanKeys.map((key) => {
					const value = Number(d[key]) || 0
					const pct = total > 0 ? (value / total) * 100 : 0
					return { key, value, pct }
				})
			})
			.enter()
			.filter((d) => d.value > 0) // <-- correct placement!
			.append("text")
			.attr("class", "bar-label")
			.attr("x", (d) => (x1(d.key) || 0) + x1.bandwidth() / 2)
			.attr("y", (d) => y(d.value) - 5)
			.attr("text-anchor", "middle")
			.attr("font-size", "10px")
			.attr("fill", "var(--color-base-content)")
			.text((d) => `${d.pct.toFixed(0)}%`)

		// Add axis labels
		svg.append("text")
			.attr("class", "x-axis-label")
			.attr("x", width / 2)
			.attr("y", height - 25)
			.attr("text-anchor", "middle")
			.attr("fill", "var(--color-base-content)")
			.text("Primary Diagnosis")

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

		cleanKeys.forEach((key, i) => {
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
			<button onClick={handleDownload} className="btn btn-primary">
				Download Plot
			</button>
		</div>
	)
}

export default ClusteredBarplot
