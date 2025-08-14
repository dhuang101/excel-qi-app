import axios from "axios"
import { useEffect } from "react"

function FileRepoPage() {
	useEffect(() => {
		axios.get("/api/database/file-repo/getFiles").then((result) => {
			console.log(result)
		})
	}, [])

	return (
		<div className="flex flex-col grow w-full items-center">
			<article className="font-semibold mt-4 text-3xl">
				File Repository
			</article>
		</div>
	)
}

export default FileRepoPage
