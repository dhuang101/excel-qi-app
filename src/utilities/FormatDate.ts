// takes the output from Date.toISOString()
export function FormatDate(date: Date) {
	const [datePart, timePart] = date.toISOString().split("T")
	const [year, month, day] = datePart.split("-")
	const [hours, minutes] = timePart.split(":") // Remove the trailing 'Z'

	return `${day}-${month}-${year} ${hours}:${minutes}`
}
