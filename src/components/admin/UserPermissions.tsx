import AdminTable from "@/components/admin/AdminTable"
import { SITE_NAMES } from "@/constants/sitesNames"
import { FormatName } from "@/utilities/FormatName"
import { CircularProgress } from "@mui/material"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"

interface User {
	email: string
	name: string
	role: string
	redcap_data_access_group: string[]
}

type ModalStatus = "selecting" | "confirming" | "updating" | "submitted"

export default function UserPermissions() {
	// nextjs router
	const router = useRouter()
	// auth session
	const { data: session, status } = useSession()
	// state
	const users = useRef<User[]>([])
	const [loading, setLoading] = useState(true)
	const [slicedUsers, setSlicedUsers] = useState<User[]>([])
	// search state
	const searchQuery = useRef("")
	// selected user state
	const [selectedUser, setSelectedUser] = useState<User | null>(null)
	const additionalSites = useRef<string[]>([])
	const removeSites = useRef<string[]>([])
	const changedRole = useRef<string>("")
	// modal state
	const [modalStatus, setModalStatus] = useState<ModalStatus>("selecting")
	const [modalKey, setModalKey] = useState(0)
	const [error, setError] = useState(false)
	const modalRef = useRef<HTMLDialogElement>(null)

	useEffect(() => {
		axios
			.get("/api/database/permissions/getAllPerms")
			.then((result) => {
				users.current = result.data
				setSlicedUsers(result.data)
				setLoading(false)
			})
			.catch((error) => {
				console.error("Error 500", error)
				router.push("/error")
			})
	}, [router])

	function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter") {
			handleEmailSearch()
		}
	}

	function handleEmailSearch() {
		setSlicedUsers(
			users.current.filter((user) =>
				user.email
					.toLowerCase()
					.includes(searchQuery.current.toLowerCase())
			)
		)
	}

	function handleUpdatePerms() {
		setModalStatus("updating")
		axios
			.post("/api/database/permissions/updatePerms", {
				email: selectedUser!.email,
				addSites: additionalSites.current,
				removeSites: removeSites.current,
				changedRole: changedRole.current,
			})
			.then(() => {
				axios
					.get("/api/database/permissions/getAllPerms")
					.then((result) => {
						users.current = result.data
					})
				setModalStatus("submitted")
			})
			.catch((error) => {
				console.error("Error 500", error)
				router.push("/error")
			})
	}

	function handleRemoveCheckbox(site: string) {
		const selected = removeSites.current
		const index = selected.indexOf(site)
		if (index === -1) selected.push(site)
		else selected.splice(index, 1)
	}

	function handleAddCheckbox(site: string) {
		const selected = additionalSites.current
		const index = selected.indexOf(site)
		if (index === -1) selected.push(site)
		else selected.splice(index, 1)
	}

	if (loading) {
		return (
			<div className="flex flex-col justify-center items-center h-[83vh]">
				<CircularProgress size={80} />
				<article className="text-lg font-semibold pt-4">
					Fetching Users...
				</article>
			</div>
		)
	}

	return (
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
				<button className="btn btn-primary" onClick={handleEmailSearch}>
					Search
				</button>
			</div>

			<AdminTable
				users={slicedUsers}
				onClick={
					session?.user.role === "admin"
						? (event) => {
								modalRef.current!.showModal()
								setSelectedUser(
									slicedUsers[
										Number(
											event.currentTarget.dataset.index
										)
									]
								)
						  }
						: undefined
				}
			/>

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
						changedRole.current = ""
						setError(false)
						setModalStatus("selecting")
						setModalKey((prev) => prev + 1)
					}
				}}
				className="modal"
			>
				<div className="modal-box max-w-3xl" key={modalKey}>
					{modalStatus === "selecting" ? (
						<React.Fragment>
							<article className="font-bold text-xl">
								Edit Permissions for {selectedUser?.email}
							</article>
							<div className="flex flex-col mt-4">
								<article className="font-semibold text-lg">
									Change Current Role
								</article>
								{selectedUser && (
									<select
										key={selectedUser?.name}
										defaultValue={
											selectedUser?.role as string
										}
										onChange={(event) => {
											changedRole.current =
												event.target.value
										}}
										className="select"
									>
										<option value={"admin"}>Admin</option>
										<option value={"global-viewer"}>
											Global-Viewer
										</option>
										<option value={"site-viewer"}>
											Site-Viewer
										</option>
										<option value={"public"}>Public</option>
									</select>
								)}
								<article className="font-semibold text-lg mt-4">
									Update Current Access
								</article>
								{selectedUser?.redcap_data_access_group.map(
									(site) => (
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
												{FormatName(site)}
											</article>
										</div>
									)
								)}
								<article className="font-semibold text-lg mt-4">
									Choose Sites to Give Access to
								</article>
								{SITE_NAMES.filter(
									(site) =>
										!selectedUser?.redcap_data_access_group.includes(
											site
										)
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
										<article>{FormatName(site)}</article>
									</div>
								))}
								<div className="flex items-center mt-8">
									<button
										className="btn btn-primary"
										onClick={() => {
											if (
												additionalSites.current.length >
													0 ||
												removeSites.current.length >
													0 ||
												changedRole.current !== ""
											) {
												setModalStatus("confirming")
											} else {
												setError(true)
											}
										}}
									>
										Update Permissions
									</button>
									{error && (
										<article className="ml-8 text-error font-semibold">
											Error: No Changes Were Made
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
							{changedRole.current !== "" && (
								<React.Fragment>
									<article className="font-semibold text-lg mt-4">
										Changing Role to:
									</article>
									<article>
										{FormatName(changedRole.current)}
									</article>
								</React.Fragment>
							)}
							{additionalSites.current.length > 0 && (
								<React.Fragment>
									<article className="font-semibold text-lg mt-4">
										Adding Access to:
									</article>
									{additionalSites.current.map((site) => (
										<article key={site}>
											{FormatName(site)}
										</article>
									))}
								</React.Fragment>
							)}
							{removeSites.current.length > 0 && (
								<React.Fragment>
									<article className="font-semibold text-lg mt-4">
										Removing Access to:
									</article>
									{removeSites.current.map((site) => (
										<article key={site}>
											{FormatName(site)}
										</article>
									))}
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
						<div>Error: You Should Not Be Seeing This</div>
					)}
				</div>
				{modalStatus !== "updating" && (
					<form method="dialog" className="modal-backdrop">
						<button>close</button>
					</form>
				)}
			</dialog>
		</React.Fragment>
	)
}
