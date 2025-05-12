// takes the site name as it is in the database and formats it for readability
export function FormatSiteName(input: string): string {
	return input
		.replace(/[-_]/g, " ")
		.split(" ")
		.map(
			(word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
		)
		.join(" ")
}
