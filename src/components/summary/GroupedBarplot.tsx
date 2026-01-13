import { useMemo } from "react"
import * as d3 from "d3"

const MARGIN = { top: 30, right: 30, bottom: 70, left: 70 }
const BAR_PADDING = 0.3
const GROUP_PADDING = 0.1

interface DataItem {
	ageRange: string
	totalCases: number
	totalDeaths: number
}

interface GroupedBarplotProps {
	width: number
	height: number
	data: DataItem[]
}

export const GroupedBarplot = ({
	width,
	height,
	data,
}: GroupedBarplotProps) => {
	const boundsWidth = width - MARGIN.right - MARGIN.left
	const boundsHeight = height - MARGIN.top - MARGIN.bottom

	const keys = ["totalCases", "totalDeaths"] as const

	const x0Scale = useMemo(() => {
		return d3
			.scaleBand()
			.domain(data.map((d) => d.ageRange))
			.range([0, boundsWidth])
			.padding(BAR_PADDING)
	}, [data, boundsWidth])

	const x1Scale = useMemo(() => {
		return d3
			.scaleBand()
			.domain(keys)
			.range([0, x0Scale.bandwidth()])
			.padding(GROUP_PADDING)
	}, [x0Scale])

	const yScale = useMemo(() => {
		const maxVal = d3.max(data, (d) =>
			Math.max(d.totalCases, d.totalDeaths)
		)
		return d3
			.scaleLinear()
			.domain([0, maxVal || 10])
			.nice()
			.range([boundsHeight, 0])
	}, [data, boundsHeight])

	const grid = yScale
		.ticks(5)
		.slice(1)
		.map((value, i) => (
			<g key={i}>
				<line
					x1={0}
					x2={boundsWidth}
					y1={yScale(value)}
					y2={yScale(value)}
					stroke="var(--color-base-content)"
					opacity={0.1}
				/>
				<text
					x={-10}
					y={yScale(value)}
					textAnchor="end"
					alignmentBaseline="middle"
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

				{data.map((d, i) => (
					<g
						key={i}
						transform={`translate(${x0Scale(d.ageRange)}, 0)`}
					>
						{keys.map((key) => {
							const val = d[key]
							const isDeath = key === "totalDeaths"

							return (
								<g key={key}>
									<rect
										x={x1Scale(key)}
										y={yScale(val)}
										width={x1Scale.bandwidth()}
										height={boundsHeight - yScale(val)}
										fill={
											isDeath
												? "var(--color-secondary)"
												: "var(--color-primary)"
										}
										opacity={0.7}
										stroke="var(--color-base-content)"
										fillOpacity={0.5}
										rx={1}
									/>
									<text
										x={
											(x1Scale(key) ?? 0) +
											x1Scale.bandwidth() / 2
										}
										y={yScale(val) - 7}
										textAnchor="middle"
										fontSize={12}
										fill="var(--color-base-content)"
									>
										{val.toFixed(0)}
									</text>
								</g>
							)
						})}
						{/* Age Label */}
						<text
							x={x0Scale.bandwidth() / 2}
							y={boundsHeight + 20}
							textAnchor="middle"
							fontSize={12}
							fill="var(--color-base-content)"
						>
							{d.ageRange}
						</text>
					</g>
				))}

				{/* Y-Axis Title */}
				<text
					transform="rotate(-90)"
					x={-boundsHeight / 2}
					y={-55}
					textAnchor="middle"
					fontSize={14}
					fill="var(--color-base-content)"
					fontWeight="bold"
				>
					Count
				</text>

				{/* Legend */}
				<g transform={`translate(${boundsWidth - 100}, -20)`}>
					<rect
						width={12}
						height={12}
						fill="var(--color-primary)"
						fillOpacity={0.5}
					/>
					<text
						x={15}
						y={10}
						fontSize={12}
						fill="var(--color-base-content)"
					>
						Cases
					</text>
					<rect
						x={60}
						width={12}
						height={12}
						fill="var(--color-secondary)"
						fillOpacity={0.5}
					/>
					<text
						x={75}
						y={10}
						fontSize={12}
						fill="var(--color-base-content)"
					>
						Deaths
					</text>
				</g>

				<text
					x={boundsWidth / 2}
					y={boundsHeight + 50}
					textAnchor="middle"
					fontWeight="bold"
					fill="var(--color-base-content)"
				>
					Age Group
				</text>
			</g>
		</svg>
	)
}
