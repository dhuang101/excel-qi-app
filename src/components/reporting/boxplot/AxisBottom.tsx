import { useMemo } from "react"
import { ScaleLinear } from "d3"

interface AxisBottomProps {
	xScale: ScaleLinear<number, number>
	pixelsPerTick: number
	height: number
}

// tick length
const TICK_LENGTH = 0

export const AxisBottom = ({
	xScale,
	pixelsPerTick,
	height,
}: AxisBottomProps) => {
	const range = xScale.range()

	const ticks = useMemo(() => {
		const width = range[1] - range[0]
		const numberOfTicksTarget = Math.floor(width / pixelsPerTick)

		const d3Ticks = xScale.ticks(numberOfTicksTarget)
		const filteredD3Ticks = d3Ticks.filter((v) => v !== 0)

		return [{ value: 0, xOffset: xScale(0) }].concat(
			filteredD3Ticks.map((value) => ({
				value,
				xOffset: xScale(value),
			})),
		)
	}, [xScale, pixelsPerTick, range])

	return (
		<>
			{/* Ticks and labels */}
			{ticks.map(({ value, xOffset }) => (
				<g
					key={value}
					transform={`translate(${xOffset}, 0)`}
					shapeRendering={"crispEdges"}
				>
					<text
						style={{
							fontSize: "12px",
							textAnchor: "middle",
							transform: "translateY(20px)",
							fill: "var(--color-base-content)",
						}}
					>
						{value}
					</text>
				</g>
			))}
		</>
	)
}
