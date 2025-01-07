export const SvgWrapText = (
	textElement: d3.Selection<SVGTextElement, any, null, undefined>,
	width: number
): void => {
	const text = textElement
	const words = text.text().split(/\s+/) // Split the text into words
	let word
	const line: string[] = []
	const lineHeight = 1.1 // Line height multiplier
	const x = text.attr("x")
	const y = text.attr("y")
	let dy = parseFloat(text.attr("dy") || "0")

	// Only wrap text if it hasn't been wrapped already
	if (text.selectAll("tspan").size() > 0) return // Exit if wrapping has already been done

	// Start with the first tspan element
	let tspan = text
		.text(null)
		.append("tspan")
		.attr("x", x)
		.attr("y", y)
		.attr("dy", dy + "em")

	while ((word = words.shift())) {
		// Shift words from the front of the array
		line.push(word)
		tspan.text(line.join(" "))

		// Safely check the computed text length
		const computedTextLength = tspan.node()?.getComputedTextLength() ?? 0

		// Check if the current tspan width exceeds the allowed width
		if (computedTextLength > width) {
			// If it does, remove the last word and start a new tspan line
			line.pop()
			tspan.text(line.join(" "))
			line.length = 0
			line.push(word) // Push the current word to start a new line
			tspan = text
				.append("tspan")
				.attr("x", x)
				.attr("y", y)
				.attr("dy", ++dy * lineHeight + "em")
				.text(word)
		}
	}
}
