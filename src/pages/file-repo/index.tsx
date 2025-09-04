import axios from "axios"
import { useSession } from "next-auth/react"
import React, { useRef } from "react"
import { useEffect, useState } from "react"

type FilesType = {
	redcap_data_access_group: string[]
	filename: string
	path: string
}

type ModalStatus = "selecting" | "confirming" | "updating" | "submitted"

function FileRepoPage() {
	// hooks
	const { data: session, status } = useSession()
	// state
	const [files, setFiles] = useState<FilesType[]>([])
	// modal state
	const [modalStatus, setModalStatus] = useState<ModalStatus>("selecting")
	const [modalKey, setModalKey] = useState(0)
	const [error, setError] = useState(false)
	const [file, setFile] = useState<File | null>(null)
	const modalRef = useRef<HTMLDialogElement>(null)

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
			})
	}, [status])

	function downloadFile(file: FilesType) {
		// we are using post to hide sensitive info
		axios
			.post(
				"/api/database/file-repo/downloadFile",
				{
					role: session?.user.role,
					sites: session?.user.sites,
					filename: file.filename,
				},
				{ responseType: "blob" }
			)
			.then((result) => {
				console.log(result)
				// build a temp link as post's do not automatically download returned files
				const fileName =
					result.headers["x-filename"] || file.filename + ".pdf"
				const url = window.URL.createObjectURL(new Blob([result.data]))
				const link = document.createElement("a")
				link.href = url
				link.setAttribute("download", fileName)
				document.body.appendChild(link)
				link.click()
				link.remove()
				window.URL.revokeObjectURL(url)
			})
	}

	return (
		<React.Fragment>
			<div className="flex flex-col grow w-full items-center">
				<div className="flex flex-col w-1/2 h-full items-center">
					<article className="font-semibold mt-4 text-3xl">
						File Repository
					</article>
					{session?.user.role !== "site-viewer" && (
						<div className="flex w-full mt-4">
							<button
								disabled
								onClick={() => {
									modalRef.current!.showModal()
								}}
								className="ml-auto btn btn-primary"
							>
								Upload
							</button>
						</div>
					)}
					{files.map((file) => {
						return (
							<div
								key={file.filename}
								className="mt-4 flex flex-col w-full"
							>
								<article
									onClick={() => {
										downloadFile(file)
									}}
									className="font-semibold text-lg underline ml-4 hover:text-primary hover:no-underline cursor-pointer"
								>
									{file.filename}
								</article>
								<div className="divider" />
							</div>
						)
					})}
				</div>
			</div>
			{/* Modal */}
			<dialog
				ref={modalRef}
				className="modal"
				onTransitionEnd={(event: React.TransitionEvent) => {
					if (
						!modalRef.current?.open &&
						event.propertyName === "visibility" &&
						modalStatus === "submitted"
					) {
						window.location.reload()
					} else if (
						!modalRef.current?.open &&
						event.propertyName === "visibility"
					) {
						setError(false)
						setModalStatus("selecting")
						setModalKey((prev) => prev + 1)
					}
				}}
			>
				<div className="modal-box w-fit p-8">
					<article className="font-semibold text-lg">
						Upload To Repository
					</article>
					<fieldset className="fieldset mt-4">
						<legend className="fieldset-legend">
							.pdf file only
						</legend>
						<input
							type="file"
							accept=".pdf"
							onChange={(e) =>
								setFile(
									e.target.files ? e.target.files[0] : null
								)
							}
							className="file-input file-input-primary"
						/>
					</fieldset>
					<button className="btn btn-primary mt-4">Preview</button>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</React.Fragment>
	)
}

export default FileRepoPage
