import { useEffect } from "react"

// TODO: currently react-twitter-embed does not support react 19
function PublicXFeed() {
	useEffect(() => {
		const script = document.createElement("script")
		script.src = "https://platform.twitter.com/widgets.js"
		script.async = true
		document.body.appendChild(script)

		return () => {
			document.body.removeChild(script)
		}
	}, [])

	return (
		<div>
			<a data-height="1000" href="https://x.com/exceloutcomes">
				Tweets by @exceloutcomes
			</a>
		</div>
	)
}

export default PublicXFeed
