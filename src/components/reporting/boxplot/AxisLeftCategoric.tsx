import { useMemo } from "react"
import { ScaleBand } from "d3"

interface AxisLeftProps {
	yScale: ScaleBand<string>
}

// tick length
const TICK_LENGTH = 6

export const AxisLeft = ({ yScale }: AxisLeftProps) => {
	const [min, max] = yScale.range()

	const ticks = useMemo(() => {
		return yScale.domain().map((value) => ({
			value,
			yOffset: (yScale(value) as number) + yScale.bandwidth() / 2,
		}))
	}, [yScale])

	return (
		<>
			{/* Main vertical line */}
			{/* <path
				d={["M", 0, min, "L", 0, max].join(" ")}
				fill="none"
				stroke="currentColor"
			/> */}

			{/* Ticks and labels */}
			{ticks.map(({ value, yOffset }) => {
				const valueMap: { [index: string]: any } = {
					outcm_ecmo_days_2: "Days on ECMO",
					outcm_icu_days: "Days in ICU",
					outcm_hosp_days: "Days in Hospital",
					outcm_mv_days_2: "Days on IMV",
				}
				return (
					<g key={value} transform={`translate(0, ${yOffset})`}>
						{/* Ticks */}
						{/* <line x2={-TICK_LENGTH} stroke="currentColor" /> */}
						<text
							key={value}
							style={{
								fontSize: "12px",
								textAnchor: "end",
								alignmentBaseline: "middle",
								transform: "translateX(-20px)",
								fill: "var(--color-base-content)",
							}}
						>
							{valueMap[value]}
						</text>
					</g>
				)
			})}
		</>
	)
}
