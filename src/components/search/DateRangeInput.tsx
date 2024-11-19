import StyledDateTimePicker from "../StyledDateTimePicker"

interface Props {
	title: string
	queryAttribute: string
	handleDateChange(area: string): void
}

function DateRangeInput(props: Props) {
	return (
		<div>
			<article className="mb-4 text-sm">{props.title}</article>
			<div className="flex w-full">
				<div className="w-1/3">
					<StyledDateTimePicker
						label="After"
						onChange={props.handleDateChange(
							props.queryAttribute + "_after"
						)}
					/>
				</div>
				<div className="w-1/12" />
				<div className="w-1/3">
					<StyledDateTimePicker
						label="Before"
						onChange={props.handleDateChange(
							props.queryAttribute + "_before"
						)}
					/>
				</div>
			</div>
		</div>
	)
}

export default DateRangeInput
