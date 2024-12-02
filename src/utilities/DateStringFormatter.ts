// takes the output from Date.toISOString()
export function DateStringFormatter(isoString: String) {
	const [datePart, timePart] = isoString.split("T")
	const [year, month, day] = datePart.split("-")
	const [hours, minutes] = timePart.split(":") // Remove the trailing 'Z'

	return `${day}-${month}-${year} ${hours}:${minutes}`
}
