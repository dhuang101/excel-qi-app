// wraps long text in the svg charts made in d3
export const SvgWrapText = (
	textElement: d3.Selection<SVGTextElement, unknown, null, undefined>,
	width: number,
	textContent: string
): void => {
	const lineHeight = 1.1
	const x = textElement.attr("x")
	const y = textElement.attr("y")

	textElement.text(null)
	const words = textContent.split(/\s+/).reverse()
	let word: string | undefined
	let line: string[] = []
	let lineNumber = 0

	let tspan = textElement.append("tspan").attr("x", x).attr("y", y)

	while ((word = words.pop())) {
		line.push(word)
		tspan.text(line.join(" "))
		if (
			(tspan.node()?.getComputedTextLength() ?? 0) > width &&
			line.length > 1
		) {
			line.pop()
			tspan.text(line.join(" "))
			line = [word]
			tspan = textElement
				.append("tspan")
				.attr("x", x)
				.attr("y", y)
				.text(word)
			lineNumber++
		}
	}

	const totalLines = textElement.selectAll("tspan").size()
	const bias = (totalLines - 1) / 2

	textElement.selectAll("tspan").attr("dy", (d, i) => {
		return (i - bias) * lineHeight + "em"
	})
}
