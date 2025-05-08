import AdminTable from "@/components/admin/AdminTable"
import axios from "axios"
import React from "react"
import { useEffect, useRef, useState } from "react"

function AdminPage() {
	const [users, setUsers] = useState([])
	const [modalSubmitted, setModalSubmitted] = useState(false)
	const modalRef = useRef<HTMLDialogElement>(null)

	useEffect(() => {
		axios.get("/api/database/permissions/getAllPerms").then((result) => {
			console.log("result", result.data)
			setUsers(result.data)
		})
	}, [])

	return (
		<div className="flex flex-col grow w-full items-center">
			<div className="w-2/3 h-full">
				<article className="my-4 text-3xl font-semibold">
					View and Edit User Permissions
				</article>
				<AdminTable
					users={users}
					onClick={() => {
						modalRef.current!.showModal()
					}}
				/>
			</div>
			<dialog
				ref={modalRef}
				onClose={() => {
					setModalSubmitted(false)
				}}
				className="modal"
			>
				<div className="modal-box max-w-3xl">
					{modalSubmitted ? (
						<div className="flex flex-col items-center justify-center h-20">
							<article className="font-semibold text-2xl">
								Request Submitted
							</article>
						</div>
					) : (
						<React.Fragment>
							<article className="font-bold text-xl">
								Request Cohort Export
							</article>
							<div className="flex flex-col mt-4">
								<article className="font-semibold text-lg">
									Searched for Patients With
								</article>
								<div>
									<button
										className="btn btn-primary mt-2"
										onClick={() => {
											setModalSubmitted(true)
										}}
									>
										Submit Request
									</button>
								</div>
							</div>
						</React.Fragment>
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
