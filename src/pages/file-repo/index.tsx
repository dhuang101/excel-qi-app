import { FormatSiteName } from "@/utilities/FormatSiteName"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

type FilesType = {
	redcap_data_access_group: string[]
	name: string
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
				{files.map((file) => {
					return (
						<div
							key={file.name}
							className="mt-4 flex flex-col w-full"
						>
							<a
								href={file.link}
								target="_blank"
								className="font-semibold text-lg underline hover:text-primary hover:no-underline cursor-pointer"
							>
								{file.name}
							</a>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default FileRepoPage
