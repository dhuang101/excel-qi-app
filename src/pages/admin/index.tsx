import AdminTable from "@/components/admin/AdminTable"
import { FormatSiteName } from "@/utilities/FormatSiteName"
import { CircularProgress } from "@mui/material"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import React from "react"
import { useEffect, useRef, useState } from "react"

import Papa from "papaparse"
import ImportPreviewTable from "@/components/admin/ImportPreviewTable"
import { TranslateExcel } from "@/utilities/TranslateExcel"
import { excelImportRow } from "@/types/excelImportTypes"

interface User {
	email: string
	role: string
	sites: string[]
}

type ModalStatus = "selecting" | "confirming" | "updating" | "submitted"
type CurrentPage = "permissions" | "import"

const SITES = [
	"alfred_hospital",
	"auckland_city_hospital",
	"box_hill_hospital",
	"john_hunter_hospital",
	"prince_charles_hospital",
	"royal_adelaide_hospital",
	"royal_north_shore_hospital",
	"royal_prince_alfred_hospital",
	"st_vincents_sydney",
	"townsville_hospital",
]

function AdminPage() {
	// hooks
	const { data: session, status } = useSession()
	const router = useRouter()
	const [currentPage, setCurrentPage] = useState<CurrentPage>("permissions")
	// state
	const users = useRef<User[]>([])
	const [slicedUsers, setSlicedUsers] = useState<User[]>([])
	// search state
	const searchQuery = useRef("")
	// selected user state
	const [selectedUser, setSelectedUser] = useState<User | null>(null)
	const additionalSites = useRef<string[]>([])
	const removeSites = useRef<string[]>([])
	// modal state
	const [modalStatus, setModalStatus] = useState<ModalStatus>("selecting")
	const [modalKey, setModalKey] = useState(0)
	const [error, setError] = useState(false)
	const modalRef = useRef<HTMLDialogElement>(null)
	// import page state
	const [file, setFile] = useState<File | null>(null)
	const [rows, setRows] = useState<excelImportRow[]>([])

	// on attach grabs on user in permissions db
	useEffect(() => {
		axios.get("/api/database/permissions/getAllPerms").then((result) => {
			users.current = result.data
			setSlicedUsers(result.data)
		})
	}, [])

	function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter") {
			handleEmailSearch()
		}
	}

	function handleEmailSearch() {
		setSlicedUsers(
			users.current.filter((user) => {
				return user.email
					.toLowerCase()
					.includes(searchQuery.current.toLowerCase())
			})
		)
	}

	// fires api on format submit
	function handleUpdatePerms() {
		setModalStatus("updating")
		axios
			.post("/api/database/permissions/updatePerms", {
				email: selectedUser!.email,
				addSites: additionalSites.current,
				removeSites: removeSites.current,
			})
			.then(() => {
				axios
					.get("/api/database/permissions/getAllPerms")
					.then((result) => {
						users.current = result.data
					})
				setModalStatus("submitted")
			})
	}

	// handles the checkboxes for removing current sites' access
	function handleRemoveCheckbox(site: string) {
		const selected = removeSites.current
		const index = selected.indexOf(site)

		if (index === -1) {
			selected.push(site)
		} else {
			selected.splice(index, 1)
		}
	}

	// handles the checkboxes for adding access to new sites
	function handleAddCheckbox(site: string) {
		const selected = additionalSites.current
		const index = selected.indexOf(site)

		if (index === -1) {
			selected.push(site)
		} else {
			selected.splice(index, 1)
		}
	}

	function handlePreview() {
		if (!file) {
			return
		}

		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: function (results) {
				// merge rows with the same record_id
				setRows(
					Object.values(
						results.data.reduce(
							(mergedRows: any, currentRow: any) => {
								if (
									Object.keys(mergedRows).includes(
										currentRow.record_id
									)
								) {
									for (const key in currentRow) {
										if (currentRow[key] === "") {
											continue
										} else {
											// translate fields from EXCEL dictionary where applicable
											TranslateExcel(currentRow, key)
											mergedRows[currentRow.record_id][
												key
											] = currentRow[key]
										}
									}
								} else {
									mergedRows[currentRow.record_id] =
										currentRow
								}
								return mergedRows
							},
							{}
						) as Record<string, any>
					)
				)
			},
		})
	}

	function handleGoBack() {
		setRows([])
		setFile(null)
	}

	function handleImport() {
		axios
			.post("/api/database/import/postCsv", {
				records: rows,
			})
			.then((response) => {
				alert(response.data.message)
				handleGoBack()
			})
	}

	return (
		<div className="flex flex-col grow w-full items-center bg-base-100">
			<div className="w-2/3 h-full">
				<article className="text-3xl font-semibold mt-4 mb-2">
					Admin Panel
				</article>
				<div role="tablist" className="tabs tabs-border tabs-lg mb-4">
					<a
						role="tab"
						className="tab tab-active"
						onClick={() => {
							setCurrentPage("permissions")
						}}
					>
						User Permissions
					</a>
					{session?.user.role === "admin" && (
						<a
							role="tab"
							className="tab"
							onClick={() => {
								setCurrentPage("import")
							}}
						>
							Import Cohort
						</a>
					)}
				</div>
				{currentPage === "permissions" ? (
					<React.Fragment>
						{/* Main Page */}
						<React.Fragment>
							<div className="flex mb-4">
								<input
									type="text"
									className="input w-80 mr-4"
									placeholder="Search by email"
									onKeyDown={handleKeyDown}
									onChange={(event) => {
										searchQuery.current = event.target.value
									}}
								/>
								<button
									className="btn btn-primary"
									onClick={handleEmailSearch}
								>
									Search
								</button>
							</div>

							<AdminTable
								users={slicedUsers}
								onClick={(event) => {
									modalRef.current!.showModal()
									setSelectedUser(
										slicedUsers[
											Number(
												event.currentTarget.dataset
													.index
											)
										]
									)
								}}
							/>
						</React.Fragment>

						{/* Modal */}
						<dialog
							ref={modalRef}
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
									additionalSites.current = []
									removeSites.current = []
									setError(false)
									setModalStatus("selecting")
									setModalKey((prev) => prev + 1)
								}
							}}
							className="modal"
						>
							<div className="modal-box max-w-3xl" key={modalKey}>
								{selectedUser?.role !== "site-viewer" ? (
									<div className="flex flex-col items-center justify-center h-18">
										<article className="font-bold text-xl">
											Cannot edit permissions for
											user&apos;s with this role!
										</article>
									</div>
								) : modalStatus === "selecting" ? (
									<React.Fragment>
										<article className="font-bold text-xl">
											Edit Permissions for{" "}
											{selectedUser?.email}
										</article>
										<div className="flex flex-col mt-4">
											<article className="font-semibold text-lg">
												Update Current Access
											</article>
											{selectedUser?.sites.map((site) => (
												<div
													key={site}
													className="flex"
												>
													<input
														type="checkbox"
														defaultChecked
														className="checkbox checkbox-primary mr-2 mb-1"
														value={site}
														onChange={() =>
															handleRemoveCheckbox(
																site
															)
														}
													/>
													<article>
														{FormatSiteName(site)}
													</article>
												</div>
											))}
											<article className="font-semibold text-lg mt-4">
												Choose Sites to Give Access to
											</article>
											{SITES.filter(
												(site) =>
													!selectedUser?.sites.includes(
														site
													)
											).map((site) => (
												<div
													key={site}
													className="flex"
												>
													<input
														type="checkbox"
														className="checkbox checkbox-primary mr-2 mb-1"
														value={site}
														onChange={() =>
															handleAddCheckbox(
																site
															)
														}
													/>
													<article>
														{FormatSiteName(site)}
													</article>
												</div>
											))}
											<div className="flex items-center mt-8">
												<button
													className="btn btn-primary"
													onClick={() => {
														if (
															additionalSites
																.current
																.length > 0 ||
															removeSites.current
																.length > 0
														) {
															setModalStatus(
																"confirming"
															)
														} else {
															setError(true)
														}
													}}
												>
													Update Permissions
												</button>
												{error && (
													<article className="ml-8 text-error font-semibold">
														Error: No Changes Were
														Made
													</article>
												)}
											</div>
										</div>
									</React.Fragment>
								) : modalStatus === "confirming" ? (
									<div className="flex flex-col">
										<article className="font-semibold text-2xl">
											Confirm Changes for:
										</article>
										<article className="font-semibold text-2xl">
											{selectedUser?.email}
										</article>
										{additionalSites.current.length > 0 && (
											<React.Fragment>
												<article className="font-semibold text-lg mt-4">
													Adding Access to:
												</article>
												{additionalSites.current.map(
													(site) => (
														<article key={site}>
															{FormatSiteName(
																site
															)}
														</article>
													)
												)}
											</React.Fragment>
										)}
										{removeSites.current.length > 0 && (
											<React.Fragment>
												<article className="font-semibold text-lg mt-4">
													Removing Access to:
												</article>
												{removeSites.current.map(
													(site) => (
														<article key={site}>
															{FormatSiteName(
																site
															)}
														</article>
													)
												)}
											</React.Fragment>
										)}
										<button
											className="btn btn-primary mt-8 min-w-24 w-1/5"
											onClick={handleUpdatePerms}
										>
											Confirm
										</button>
									</div>
								) : modalStatus === "updating" ? (
									<div className="flex flex-col items-center justify-center h-40">
										<CircularProgress size={80} />
										<article className="text-lg font-semibold pt-4">
											Updating Permissions...
										</article>
									</div>
								) : modalStatus === "submitted" ? (
									<div className="flex flex-col items-center justify-center h-20">
										<article className="font-semibold text-2xl">
											Permissions Updated
										</article>
									</div>
								) : (
									<div>
										Error: You Should Not Be Seeing This
									</div>
								)}
							</div>
							<form method="dialog" className="modal-backdrop">
								<button>close</button>
							</form>
						</dialog>
					</React.Fragment>
				) : (
					<React.Fragment>
						{rows.length > 0 ? (
							<div className="flex flex-col items-center w-4/5 h-full">
								<article className="text-2xl font-semibold my-4">
									Import Preview
								</article>
								<div className="w-4/5 flex justify-between">
									<button
										className="btn btn-primary mb-4"
										onClick={handleGoBack}
									>
										Go Back
									</button>
									<button
										className="btn btn-primary mb-4"
										onClick={handleImport}
									>
										Import
									</button>
								</div>
								<ImportPreviewTable records={rows} />
							</div>
						) : (
							<div className="flex w-full justify-center">
								<div>
									<fieldset className="fieldset">
										<legend className="fieldset-legend">
											.csv file only
										</legend>
										<input
											type="file"
											accept=".csv"
											onChange={(e) =>
												setFile(
													e.target.files
														? e.target.files[0]
														: null
												)
											}
											className="file-input file-input-primary"
										/>
										<label className="label">
											Max size 1MB
										</label>
									</fieldset>
									<button
										className="btn btn-primary mt-2"
										onClick={handlePreview}
									>
										Preview
									</button>
								</div>
							</div>
						)}
					</React.Fragment>
				)}
			</div>
		</div>
	)
}

export default AdminPage
