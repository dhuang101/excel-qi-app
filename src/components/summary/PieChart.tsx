import { useMemo } from "react"
import * as d3 from "d3"

interface PieChartProps<T> {
	width: number
	height: number
	data: T[]
	categoryKey: keyof T
	valueKey: keyof T
}

export const PieChart = <T,>({
	width,
	height,
	data,
	categoryKey,
	valueKey,
}: PieChartProps<T>) => {
	const MARGIN = { top: 40, right: 150, bottom: 40, left: 40 }
	const chartWidth = width - MARGIN.right - MARGIN.left
	const chartHeight = height - MARGIN.top - MARGIN.bottom
	const radius = Math.min(chartWidth, chartHeight) / 2

	const themeColors = [
		"var(--color-primary)",
		"var(--color-secondary)",
		"var(--color-accent)",
		"var(--color-error)",
		"var(--color-neutral)",
		"var(--color-info)",
	]

	const pieGenerator = useMemo(() => {
		return d3
			.pie<T>()
			.value((d) => Number(d[valueKey]))
			.sort(null)
	}, [valueKey])

	const arcGenerator = d3
		.arc<d3.PieArcDatum<T>>()
		.innerRadius(0)
		.outerRadius(radius)

	const labelArcGenerator = d3
		.arc<d3.PieArcDatum<T>>()
		.innerRadius(radius * 0.6)
		.outerRadius(radius * 0.9)

	const arcs = useMemo(() => pieGenerator(data), [data, pieGenerator])

	const colorScale = useMemo(() => {
		const categories = data.map((d) => String(d[categoryKey]))
		return d3.scaleOrdinal().domain(categories).range(themeColors)
	}, [data, categoryKey, themeColors])

	return (
		<svg width={width} height={height}>
			{/* Pie Slices */}
			<g
				transform={`translate(${MARGIN.left + radius}, ${
					MARGIN.top + radius
				})`}
			>
				{arcs.map((arc, i) => {
					const label = String(arc.data[categoryKey])
					const percentage = (
						((arc.endAngle - arc.startAngle) / (2 * Math.PI)) *
						100
					).toFixed(1)

					return (
						<g key={i}>
							<path
								d={arcGenerator(arc) || ""}
								fill={colorScale(label) as string}
								fillOpacity={0.5}
							/>
							{arc.endAngle - arc.startAngle > 0.25 && (
								<text
									transform={`translate(${labelArcGenerator.centroid(
										arc
									)})`}
									textAnchor="middle"
									alignmentBaseline="middle"
									fontSize={12}
									fill="var(--color-base-content)"
									style={{ pointerEvents: "none" }}
								>
									{percentage}%
								</text>
							)}
						</g>
					)
				})}
			</g>

			<g
				transform={`translate(${MARGIN.left + radius * 2 + 40}, ${
					MARGIN.top
				})`}
			>
				{data.map((d, i) => {
					const label = String(d[categoryKey])
					return (
						<g key={label} transform={`translate(0, ${i * 25})`}>
							<rect
								width={12}
								height={12}
								fill={colorScale(label) as string}
								fillOpacity={0.5}
								stroke="var(--color-base-content)"
								strokeWidth={1}
								rx={1}
							/>
							<text
								x={20}
								y={10}
								fontSize={12}
								fill="var(--color-base-content)"
								alignmentBaseline="middle"
							>
								{label}
							</text>
						</g>
					)
				})}
			</g>
		</svg>
	)
}
