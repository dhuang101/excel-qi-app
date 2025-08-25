import { FormatSiteName } from "@/utilities/FormatSiteName"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

type FilesType = {
	redcap_data_access_group: string
	files: { name: string; link: string }[]
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
			.post("/api/database/file-repo/getFiles", {
				role: session?.user.role,
				sites: session?.user.sites,
			})
			.then((result) => {
				setFiles(result.data)
				console.log(result.data)
			})
	}, [status])

	return (
		<div className="flex flex-col grow w-full items-center">
			<div className="flex flex-col w-2/3 h-full items-center">
				<article className="font-semibold mt-4 text-3xl">
					File Repository
				</article>
				{files.map((site) => {
					return (
						<div className="mt-4 flex flex-col w-full items-center">
							<article
								className="font-semibold text-lg"
								key={site.redcap_data_access_group}
							>
								{FormatSiteName(site.redcap_data_access_group)}
							</article>
							<div className="w-full mt-2">
								{site.files.map((file) => {
									return (
										<div
											key={file.name}
											className="flex w-full justify-around"
										>
											<article>{file.name}</article>
											<article>{file.link}</article>
										</div>
									)
								})}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default FileRepoPage
