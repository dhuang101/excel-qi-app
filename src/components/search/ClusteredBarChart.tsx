import React, { useRef, useEffect } from "react"
import * as d3 from "d3"

type ClusteredBarChartProps = {
	data: { category: string; [key: string]: number | string }[]
	keys: any[]
	width?: number
	height?: number
	margin?: { top: number; right: number; bottom: number; left: number }
}

const ClusteredBarChart: React.FC<ClusteredBarChartProps> = ({
	data,
	keys,
	width = 2500,
	height = 400,
	margin = { top: 30, right: 200, bottom: 50, left: 50 },
}) => {
	const svgRef = useRef<SVGSVGElement | null>(null)

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
			.style("font-size", "12px")
			.style("fill", "oklch(var(--bc))")
			.style("text-anchor", "center")

		// Add y-axis
		chartGroup
			.append("g")
			.call(yAxis)
			.selectAll("text")
			.style("font-size", "12px")
			.style("fill", "oklch(var(--bc))")

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
			.attr("height", (d) => chartHeight - y(d.value))
			.attr("stroke", "oklch(var(--bc)")
			.attr("stroke-width", "1")
			.attr("fill", (d) => color(d.key) || "#000")
			.attr("fill-opacity", "0.6")

		// Add labels for the x-axis
		svg.append("text")
			.attr("class", "x-axis-label")
			.attr("x", width / 2)
			.attr("y", height - 5)
			.attr("text-anchor", "middle")
			.attr("fill", "oklch(var(--bc)")
			.text("Categories")

		// Add labels for the y-axis
		svg.append("text")
			.attr("class", "y-axis-label")
			.attr("x", -(height / 2))
			.attr("y", 15)
			.attr("transform", "rotate(-90)")
			.attr("fill", "oklch(var(--bc)")
			.attr("text-anchor", "middle")
			.text("Values")

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
				.style("font-size", "12px")
				.style("fill", "oklch(var(--bc)")
				.text(key)
		})
	}, [data, keys, width, height, margin])

	return <svg ref={svgRef}></svg>
}

export default ClusteredBarChart
