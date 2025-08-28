import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

type FilesType = {
	redcap_data_access_group: string[]
	filename: string
	link: string
}

function FileRepoPage() {
	// hooks
	const { data: session, status } = useSession()
	// state
	const [files, setFiles] = useState<FilesType[]>([])

	useEffect(() => {
		if (status !== "authenticated") {
			return
		}
		axios
			.post("/api/database/file-repo/getFilesMetadata", {
				role: session?.user.role,
				sites: session?.user.sites,
			})
			.then((result) => {
				setFiles(result.data)
				console.log(result.data)
			})
	}, [status])

	function downloadFile(filename: string) {
		axios
			.post(
				"/api/database/file-repo/downloadFile",
				{
					role: session?.user.role,
					sites: session?.user.sites,
					filename: filename,
				},
				{ responseType: "blob" }
			)
			.then((result) => {
				const url = window.URL.createObjectURL(new Blob([result.data]))
				const link = document.createElement("a")
				link.href = url
				link.setAttribute("download", `${filename}.pdf`) // name the downloaded file
				document.body.appendChild(link)
				link.click()
				link.remove()
				window.URL.revokeObjectURL(url)
			})
	}

	return (
		<div className="flex flex-col grow w-full items-center">
			<div className="flex flex-col w-2/3 h-full items-center">
				<article className="font-semibold mt-4 text-3xl">
					File Repository
				</article>
				{files.map((file) => {
					return (
						<div
							key={file.filename}
							className="mt-4 flex flex-col w-full"
						>
							<article
								onClick={() => {
									downloadFile(file.filename)
								}}
								className="font-semibold text-lg underline hover:text-primary hover:no-underline cursor-pointer"
							>
								{file.filename}
							</article>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default FileRepoPage
