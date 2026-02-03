import { useMemo } from "react"
import * as d3 from "d3"

const MARGIN = { top: 40, right: 40, bottom: 40, left: 40 }
const LEGEND_WIDTH = 120 // Width reserved for legend text
const GAP = 40 // Space between the pie and the legend

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
	const { radius, centerX, centerY, legendX, legendY } = useMemo(() => {
		const innerW = width - MARGIN.left - MARGIN.right
		const innerH = height - MARGIN.top - MARGIN.bottom

		const r = Math.min(innerW - LEGEND_WIDTH - GAP, innerH) / 2

		const totalContentWidth = r * 2 + GAP + LEGEND_WIDTH
		const totalContentHeight = Math.max(r * 2, data.length * 25)

		const horizontalCenteringOffset =
			MARGIN.left + (innerW - totalContentWidth) / 2

		return {
			radius: r,
			centerX: horizontalCenteringOffset + r,
			centerY: height / 2,
			legendX: horizontalCenteringOffset + r * 2 + GAP,
			legendY: (height - data.length * 25) / 10,
		}
	}, [width, height, data.length])

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
			{/* Pie Chart Group */}
			<g transform={`translate(${centerX}, ${centerY})`}>
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
								fillOpacity={1}
							/>
							{arc.endAngle - arc.startAngle > 0.25 && (
								<text
									transform={`translate(${labelArcGenerator.centroid(
										arc,
									)})`}
									textAnchor="middle"
									alignmentBaseline="middle"
									fontSize={12}
									fill="var(--color-primary-content)"
									style={{ pointerEvents: "none" }}
								>
									{percentage}%
								</text>
							)}
						</g>
					)
				})}
			</g>

			{/* Legend Group */}
			<g transform={`translate(${legendX}, ${legendY})`}>
				{data.map((d, i) => {
					const label = String(d[categoryKey])
					return (
						<g key={label} transform={`translate(0, ${i * 25})`}>
							<rect
								width={12}
								height={12}
								fill={colorScale(label) as string}
								fillOpacity={1}
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
