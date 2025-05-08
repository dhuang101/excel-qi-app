import Table from "../baseComponents/Table"

interface Props {
	// patientData is the object returned by the API
	users: user[]
}

interface user {
	email: string
	role: string
	sites: string[]
}

function formatString(input: string): string {
	return input
		.replace(/[-_]/g, " ")
		.split(" ")
		.map(
			(word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
		)
		.join(" ")
}

const headers = ["Email", "Role", "Sites"]

function AdminTable({ users }: Props) {
	return (
		<Table
			data={users}
			headers={headers}
			emptyMessage="Error fetching data"
			renderRow={(user, i) => (
				<tr
					key={i}
					className="cursor-pointer hover:text-accent-content hover:bg-accent"
				>
					<td>{user.email}</td>
					<td>{formatString(user.role)}</td>
					<td className="flex flex-col">
						{["admin", "global-viewer"].includes(user.role) ? (
							<div>All</div>
						) : user.sites.length === 0 ? (
							<div>None</div>
						) : (
							user.sites.map((site, idx) => (
								<div key={idx}>{formatString(site)}</div>
							))
						)}
					</td>
				</tr>
			)}
		/>
	)
}

export default AdminTable
