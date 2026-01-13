import { useMemo } from "react"
import * as d3 from "d3"

const MARGIN = { top: 40, right: 150, bottom: 40, left: 40 }

const THEME_COLORS = [
	"var(--color-primary)",
	"var(--color-secondary)",
	"var(--color-accent)",
	"var(--color-error)",
	"var(--color-neutral)",
	"var(--color-info)",
]

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
	const { chartWidth, chartHeight, radius } = useMemo(() => {
		const innerW = width - MARGIN.right - MARGIN.left
		const innerH = height - MARGIN.top - MARGIN.bottom
		return {
			chartWidth: innerW,
			chartHeight: innerH,
			radius: Math.min(innerW, innerH) / 2,
		}
	}, [width, height])

	const pieGenerator = useMemo(() => {
		return d3
			.pie<T>()
			.value((d) => Number(d[valueKey]))
			.sort(null)
	}, [valueKey])

	const { arcGenerator, labelArcGenerator } = useMemo(() => {
		return {
			arcGenerator: d3
				.arc<d3.PieArcDatum<T>>()
				.innerRadius(0)
				.outerRadius(radius),
			labelArcGenerator: d3
				.arc<d3.PieArcDatum<T>>()
				.innerRadius(radius * 0.6)
				.outerRadius(radius * 0.9),
		}
	}, [radius])

	const arcs = useMemo(() => pieGenerator(data), [data, pieGenerator])

	const colorScale = useMemo(() => {
		const categories = data.map((d) => String(d[categoryKey]))
		return d3.scaleOrdinal().domain(categories).range(THEME_COLORS)
	}, [data, categoryKey])

	return (
		<svg width={width} height={height}>
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
							{/* Hide labels for very small slices */}
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

			{/* Legend Section */}
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
