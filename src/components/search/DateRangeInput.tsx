import StyledDateTimePicker from "./StyledDateTimePicker"

interface Props {
	title: string
	queryAttribute: string
	handleDateChange(area: string): void
}

function DateRangeInput({ title, queryAttribute, handleDateChange }: Props) {
	return (
		<div>
			<article className="mb-2 text-sm">{title}</article>
			<div className="flex w-full">
				<div className="w-1/4">
					<StyledDateTimePicker
						label="After"
						onChange={handleDateChange(queryAttribute + "_after")}
					/>
				</div>
				<div className="w-1/12" />
				<div className="w-1/4">
					<StyledDateTimePicker
						label="Before"
						onChange={handleDateChange(queryAttribute + "_before")}
					/>
				</div>
			</div>
		</div>
	)
}

export default DateRangeInput
