import { CircularProgress } from "@mui/material"
import { SITE_NAMES } from "@/constants/sitesNames"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import React, { useRef } from "react"
import { useEffect, useState } from "react"
import { FormatName } from "@/utilities/FormatName"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import MoreVertIcon from "@mui/icons-material/MoreVert"

type FilesType = {
	redcap_data_access_group: string[]
	filename: string
	path: string
}

type ModalStatus = "selecting" | "uploading" | "submitted"
type EditModalStatus = "selecting" | "editing" | "edited"
type DeleteModalStatus = "confirming" | "deleting" | "deleted"

function FileRepoPage() {
	// hooks
	const router = useRouter()
	const { data: session, status } = useSession()
	// state
	const [files, setFiles] = useState<FilesType[]>([])
	const [loading, setLoading] = useState(false)
	// upload modal state
	const [modalStatus, setModalStatus] = useState<ModalStatus>("selecting")
	const [modalKey, setModalKey] = useState(0)
	const [error, setError] = useState<string | null>(null)
	const [file, setFile] = useState<File | null>(null)
	const [name, setName] = useState("")
	const [sites, setSites] = useState<string[]>([])
	const modalRef = useRef<HTMLDialogElement>(null)
	// edit modal state
	const [editModalStatus, setEditModalStatus] =
		useState<EditModalStatus>("selecting")
	const editModalRef = useRef<HTMLDialogElement>(null)
	const [editError, setEditError] = useState<string | null>(null)
	const [selectedFileToEdit, setSelectedFileToEdit] = useState<FilesType>()
	const [editedName, setEditedName] = useState("")
	const [editedSites, setEditedSites] = useState<string[]>([])
	// delete modal state
	const [deleteModalStatus, setDeleteModalStatus] =
		useState<DeleteModalStatus>("confirming")
	const deleteModalRef = useRef<HTMLDialogElement>(null)
	const [selectedFileToDelete, setSelectedFileToDelete] =
		useState<FilesType>()

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
				console.error("Error 500", error)
				router.push("/error")
			})
	}, [status, router, session?.user.role, session?.user.sites])

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
				console.error("Error 500", error)
				router.push("/error")
			})
	}

	function uploadFile() {
		if (!file) {
			setError("Error: Please select a file to upload.")
			return
		}
		if (!name.trim()) {
			setError("Error: Please enter a file name.")
			return
		}
		if (sites.length === 0) {
			setError("Error: Please select at least one site.")
			return
		}
		if (files.map((file) => file.filename).includes(editedName)) {
			setError("Error: File With Name Already Exists")
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
				console.error("Error 500", error)
				router.push("/error")
			})
	}

	function updateFile() {
		if (
			editedName === selectedFileToEdit?.filename &&
			editedSites === selectedFileToEdit.redcap_data_access_group
		) {
			setEditError("Error: No Changes Detected")
			return
		}

		if (files.map((file) => file.filename).includes(editedName)) {
			setEditError("Error: File With Name Already Exists")
			return
		}

		axios
			.post("/api/database/file-repo/updateFile", {
				filename: selectedFileToEdit?.filename,
				newName: editedName,
				newSites: editedSites,
			})
			.then(() => {
				setEditModalStatus("edited")
			})
			.catch((error) => {
				console.error("Error updating file metadata:", error)
				router.push("/error")
			})
	}

	function deleteFile() {
		setDeleteModalStatus("deleting")
		axios
			.post("/api/database/file-repo/deleteFile", selectedFileToDelete)
			.then(() => {
				setDeleteModalStatus("deleted")
			})
			.catch((error) => {
				console.error("Error 500", error)
				router.push("/error")
			})
	}

	return (
		<React.Fragment>
			<div className="flex flex-col grow w-full items-center bg-base-100">
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
									className="flex flex-col w-full mt-8"
								>
									<div className="flex justify-between">
										<article
											onClick={() => {
												downloadFile(file)
											}}
											className="font-semibold text-lg underline ml-4 hover:text-primary hover:no-underline cursor-pointer"
										>
											{file.filename}
										</article>
										{session?.user.role === "admin" && (
											<div className="dropdown dropdown-end">
												<div
													tabIndex={0}
													role="button"
													className="btn btn-square btn-info btn-ghost"
												>
													<MoreVertIcon />
												</div>
												<ul
													tabIndex={0}
													className="dropdown-content menu bg-base-300 rounded-box z-1 w-52 p-2 shadow-sm"
												>
													<li>
														<a
															onClick={() => {
																setSelectedFileToEdit(
																	file
																)
																setEditedName(
																	file.filename
																)
																setEditedSites(
																	file.redcap_data_access_group ||
																		[]
																)
																editModalRef.current!.showModal()
															}}
														>
															Edit File
														</a>
													</li>
													<li>
														<a
															className="text-error"
															onClick={() => {
																setSelectedFileToDelete(
																	file
																)
																deleteModalRef.current!.showModal()
															}}
														>
															Delete File
														</a>
													</li>
												</ul>
											</div>
										)}
									</div>
									<div className="divider" />
								</div>
							)
						})}
					</div>
				)}
			</div>
			{/* Upload Modal */}
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
						setName("")
						setSites([])
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
									<article>{FormatName(site)}</article>
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
				{modalStatus !== "uploading" && (
					<form method="dialog" className="modal-backdrop">
						<button>close</button>
					</form>
				)}
			</dialog>
			{/* Edit Modal */}
			<dialog
				ref={editModalRef}
				className="modal"
				onTransitionEnd={(event: React.TransitionEvent) => {
					if (
						!editModalRef.current?.open &&
						event.propertyName === "visibility" &&
						editModalStatus === "edited"
					) {
						window.location.reload()
					} else if (
						!editModalRef.current?.open &&
						event.propertyName === "visibility"
					) {
						setEditedName("")
						setEditedSites([])
					}
				}}
			>
				<div className="modal-box max-w-xl p-8">
					{editModalStatus === "selecting" ? (
						<React.Fragment>
							<article className="font-semibold text-xl mb-4">
								Edit File Metadata
							</article>
							<div className="mb-4">
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
									value={editedName}
									onChange={(e) =>
										setEditedName(e.target.value)
									}
									className="input input-primary w-full"
								/>
							</div>
							<article className="font-semibold mt-4 mb-2">
								Select Site Access
							</article>
							{SITE_NAMES.map((site) => (
								<div key={site} className="flex">
									<input
										type="checkbox"
										className="checkbox checkbox-primary mr-2 mb-1"
										value={site}
										checked={editedSites.includes(site)}
										onChange={(e) => {
											if (e.target.checked) {
												setEditedSites((prev) => [
													...prev,
													site,
												])
											} else {
												setEditedSites((prev) =>
													prev.filter(
														(s) => s !== site
													)
												)
											}
										}}
									/>
									<article>{FormatName(site)}</article>
								</div>
							))}
							<div className="flex items-center mt-4">
								<button
									className="btn btn-primary"
									onClick={updateFile}
								>
									Save Changes
								</button>
								{editError && (
									<article className="ml-8 text-error font-semibold">
										Error: No Changes Were Made
									</article>
								)}
							</div>
						</React.Fragment>
					) : editModalStatus === "editing" ? (
						<div className="flex flex-col justify-center items-center p-16">
							<CircularProgress size={80} />
							<article className="text-lg font-semibold pt-4">
								Editing File...
							</article>
							<article className="pt-2">
								This may take a moment
							</article>
						</div>
					) : editModalStatus === "edited" ? (
						<div className="flex flex-col justify-center items-center p-16">
							<article className="text-3xl font-semibold">
								File Edited Successfully
							</article>
						</div>
					) : (
						<div>Error: You Should Not Be Seeing This</div>
					)}
				</div>
				{editModalStatus !== "editing" && (
					<form method="dialog" className="modal-backdrop">
						<button>close</button>
					</form>
				)}
			</dialog>
			{/* Delete Modal */}
			<dialog
				ref={deleteModalRef}
				className="modal"
				onTransitionEnd={(event: React.TransitionEvent) => {
					if (
						!deleteModalRef.current?.open &&
						event.propertyName === "visibility" &&
						deleteModalStatus === "deleted"
					) {
						window.location.reload()
					} else if (
						!deleteModalRef.current?.open &&
						event.propertyName === "visibility"
					) {
						setSelectedFileToDelete(undefined)
						setDeleteModalStatus("confirming")
					}
				}}
			>
				<div className="modal-box max-w-md p-8">
					{deleteModalStatus === "confirming" ? (
						<React.Fragment>
							<article className="text-lg">
								Are you sure you want to delete
							</article>
							<article className="text-lg mb-8">
								{selectedFileToDelete?.filename}?
							</article>
							<div className="flex items-center mt-4">
								<button
									className="btn btn-error"
									onClick={deleteFile}
								>
									Delete
								</button>
							</div>
						</React.Fragment>
					) : deleteModalStatus === "deleting" ? (
						<div className="flex flex-col justify-center items-center p-16">
							<CircularProgress size={80} />
							<article className="text-lg font-semibold pt-4">
								Deleting File...
							</article>
							<article className="pt-2">
								This may take a moment
							</article>
						</div>
					) : deleteModalStatus === "deleted" ? (
						<div className="flex flex-col justify-center items-center py-16">
							<article className="text-3xl font-semibold">
								File Deleted Successfully
							</article>
						</div>
					) : (
						<div>Error: You Should Not Be Seeing This</div>
					)}
				</div>
				{deleteModalStatus !== "deleting" && (
					<form method="dialog" className="modal-backdrop">
						<button>close</button>
					</form>
				)}
			</dialog>
		</React.Fragment>
	)
}

export default FileRepoPage
