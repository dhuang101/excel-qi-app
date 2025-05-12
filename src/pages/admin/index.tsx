import AdminTable from "@/components/admin/AdminTable"
import { FormatSiteName } from "@/utilities/FormatSiteName"
import axios from "axios"
import { useSession } from "next-auth/react"
import React from "react"
import { useEffect, useRef, useState } from "react"

interface User {
	email: string
	role: string
	sites: string[]
}

type ModalStatus = "selecting" | "confirming" | "submitted"

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
	// auth session
	const { data: session, status } = useSession()
	// state
	const [users, setUsers] = useState<User[]>([])
	const [selectedUser, setSelectedUser] = useState<User | null>(null)
	const additionalSites = useRef<string[]>([])
	const removeSites = useRef<string[]>([])
	// modal state
	const [modalStatus, setModalStatus] = useState<ModalStatus>("selecting")
	const modalRef = useRef<HTMLDialogElement>(null)

	// on attach grabs on user in permissions db
	useEffect(() => {
		axios.get("/api/database/permissions/getAllPerms").then((result) => {
			setUsers(result.data)
		})
	}, [])

	// fires api on format submit
	function handleUpdatePerms() {
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
						setUsers(result.data)
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

	return (
		<div className="flex flex-col grow w-full items-center">
			<div className="w-2/3 h-full">
				{session?.user.role === "admin" ? (
					<React.Fragment>
						<article className="my-4 text-3xl font-semibold">
							View and Edit User Permissions
						</article>
						<AdminTable
							users={users}
							onClick={(event) => {
								modalRef.current!.showModal()
								setSelectedUser(
									users[
										Number(
											event.currentTarget.dataset.index
										)
									]
								)
							}}
						/>
					</React.Fragment>
				) : (
					<React.Fragment>
						<article className="my-4 text-3xl font-semibold">
							View User Permissions
						</article>
						<AdminTable users={users} />
					</React.Fragment>
				)}
			</div>
			<dialog
				ref={modalRef}
				onClose={() => {
					setModalStatus("selecting")
				}}
				className="modal"
			>
				<div className="modal-box max-w-3xl">
					{modalStatus === "selecting" ? (
						<React.Fragment>
							<article className="font-bold text-xl">
								Edit Permissions for {selectedUser?.email}
							</article>
							<div className="flex flex-col mt-4">
								<article className="font-semibold text-lg">
									Update Current Access
								</article>
								{selectedUser?.role !== "site-viewer" ? (
									<article>All</article>
								) : (
									selectedUser?.sites.map((site) => (
										<div key={site} className="flex">
											<input
												type="checkbox"
												defaultChecked
												className="checkbox checkbox-primary mr-2 mb-1"
												value={site}
												onChange={() =>
													handleRemoveCheckbox(site)
												}
											/>
											<article>
												{FormatSiteName(site)}
											</article>
										</div>
									))
								)}
								<article className="font-semibold text-lg mt-4">
									Choose Sites to Give Access To
								</article>
								{SITES.filter(
									(site) =>
										!selectedUser?.sites.includes(site)
								).map((site) => (
									<div key={site} className="flex">
										<input
											type="checkbox"
											className="checkbox checkbox-primary mr-2 mb-1"
											value={site}
											onChange={() =>
												handleAddCheckbox(site)
											}
										/>
										<article>
											{FormatSiteName(site)}
										</article>
									</div>
								))}
								<div>
									<button
										className="btn btn-primary mt-8"
										onClick={() => {
											setModalStatus("confirming")
										}}
									>
										Update Permissions
									</button>
								</div>
							</div>
						</React.Fragment>
					) : modalStatus === "confirming" ? (
						<div className="flex flex-col items-center justify-center h-20">
							<article className="font-semibold text-2xl">
								You have selected to
							</article>
							<button
								className="btn btn-primary mt-8"
								onClick={handleUpdatePerms}
							>
								Update Permissions
							</button>
						</div>
					) : modalStatus === "submitted" ? (
						<div className="flex flex-col items-center justify-center h-20">
							<article className="font-semibold text-2xl">
								Permissions Updated
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
		</div>
	)
}

export default AdminPage
