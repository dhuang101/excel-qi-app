import AdminTable from "@/components/admin/AdminTable"
import axios from "axios"
import { useEffect, useState } from "react"

function AdminPage() {
	const [users, setUsers] = useState([])

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
				<AdminTable users={users} />
			</div>
		</div>
	)
}

export default AdminPage
