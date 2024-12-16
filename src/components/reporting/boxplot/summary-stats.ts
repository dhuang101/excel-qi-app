import * as d3 from "d3"

// Takes an array of numbers and compute some summary statistics from it like quantiles, median..
// Those summary statistics are the info needed to draw a boxplot
export const getSummaryStats = (data: number[]) => {
	const sortedData = data.sort(function (a, b) {
		return a - b
	})

	const q1 = d3.quantile(sortedData, 0.25)
	const median = d3.quantile(sortedData, 0.5)
	const q3 = d3.quantile(sortedData, 0.75)

	if (!q3 || !q1 || !median) {
		return
	}

	const min = data[0]
	const max = data[data.length - 1]

	return { min, q1, median, q3, max }
}
