import { CircularProgress } from "@mui/material"
import { SITE_NAMES } from "@/constants/sitesNames"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import React, { useRef } from "react"
import { useEffect, useState } from "react"
import { FormatSiteName } from "@/utilities/FormatSiteName"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"

type FilesType = {
	redcap_data_access_group: string[]
	filename: string
	path: string
}

type ModalStatus = "selecting" | "uploading" | "submitted"

function FileRepoPage() {
	// hooks
	const router = useRouter()
	const { data: session, status } = useSession()
	// state
	const [files, setFiles] = useState<FilesType[]>([])
	const [loading, setLoading] = useState(false)
	// modal state
	const [modalStatus, setModalStatus] = useState<ModalStatus>("selecting")
	const [modalKey, setModalKey] = useState(0)
	const [error, setError] = useState<string | null>(null)
	// file upload state
	const [file, setFile] = useState<File | null>(null)
	const [name, setName] = useState("")
	const [sites, setSites] = useState<string[]>([])
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
			.catch((error) => {
				console.error("Error fetching permissions:", error)
				router.push("/error")
			})
	}, [status])

	function downloadFile(file: FilesType) {
		setLoading(true)
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
			.then(() => {
				setLoading(false)
			})
			.catch((error) => {
				console.error("Error fetching permissions:", error)
				router.push("/error")
			})
	}

	function uploadFile() {
		if (!file) {
			setError("Please select a file to upload.")
			return
		}
		if (!name.trim()) {
			setError("Please enter a file name.")
			return
		}
		if (sites.length === 0) {
			setError("Please select at least one site.")
			return
		}

		setError(null)
		setModalStatus("uploading")

		const formData = new FormData()
		formData.append("file", file)
		formData.append("customName", name)
		formData.append("sites", JSON.stringify(sites))

		axios
			.post("/api/database/file-repo/uploadFile", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			})
			.then(() => {
				setModalStatus("submitted")
			})
			.catch((error) => {
				console.error("Error fetching permissions:", error)
				router.push("/error")
			})
	}

	return (
		<React.Fragment>
			<div className="flex flex-col grow w-full items-center">
				{loading ? (
					<div className="flex flex-col justify-center items-center h-[83vh]">
						<CircularProgress size={80} />
						<article className="text-lg font-semibold pt-4">
							Fetching File...
						</article>
						<article className="pt-2">
							This may take a moment
						</article>
					</div>
				) : (
					<div className="flex flex-col w-1/2 h-full items-center">
						<article className="font-semibold mt-4 text-3xl">
							File Repository
						</article>
						{session?.user.role === "admin" && (
							<div className="flex w-full mt-4">
								<button
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
				)}
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
						setError(null)
						setModalStatus("selecting")
						setModalKey((prev) => prev + 1)
					}
				}}
			>
				<div className="modal-box max-w-xl p-8" key={modalKey}>
					{modalStatus === "selecting" ? (
						<div className="flex flex-col">
							<article className="font-semibold text-xl">
								Upload To Repository
							</article>
							<article className="font-semibold mt-4">
								Choose File
							</article>
							<fieldset className="fieldset">
								<legend className="fieldset-legend">
									.pdf file only
								</legend>
								<input
									type="file"
									accept=".pdf"
									onChange={(e) =>
										setFile(
											e.target.files
												? e.target.files[0]
												: null
										)
									}
									className="file-input file-input-primary"
								/>
							</fieldset>
							<div className="flex items-center mt-4 mb-2">
								<article className="font-semibold">
									Enter File Name
								</article>
								<div
									className="tooltip tooltip-accent ml-2"
									data-tip="This will be the name shown on the page"
								>
									<InfoOutlinedIcon className="" />
								</div>
							</div>
							<input
								type="text"
								placeholder="Enter file name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="input input-primary"
							/>
							<article className="font-semibold mt-4 mb-2">
								Select Site Access
							</article>
							{SITE_NAMES.map((site) => (
								<div key={site} className="flex">
									<input
										type="checkbox"
										className="checkbox checkbox-primary mr-2 mb-1"
										value={site}
										checked={sites.includes(site)}
										onChange={(e) => {
											if (e.target.checked) {
												setSites((prev) => [
													...prev,
													site,
												])
											} else {
												setSites((prev) =>
													prev.filter(
														(s) => s !== site
													)
												)
											}
										}}
									/>
									<article>{FormatSiteName(site)}</article>
								</div>
							))}
							<div className="flex items-center mt-4">
								<button
									className="btn btn-primary"
									onClick={uploadFile}
								>
									Upload
								</button>
								{error && (
									<article className="ml-8 text-error font-semibold">
										Error: No Changes Were Made
									</article>
								)}
							</div>
						</div>
					) : modalStatus === "uploading" ? (
						<div className="flex flex-col justify-center items-center p-16">
							<CircularProgress size={80} />
							<article className="text-lg font-semibold pt-4">
								Uploading File...
							</article>
							<article className="pt-2">
								This may take a moment
							</article>
						</div>
					) : modalStatus === "submitted" ? (
						<div className="flex flex-col justify-center items-center p-16">
							<article className="text-3xl font-semibold">
								File Uploaded Successfully
							</article>
						</div>
					) : (
						<div>Error: You Should Not Be Seeing This</div>
					)}
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</React.Fragment>
	)
}

export default FileRepoPage
