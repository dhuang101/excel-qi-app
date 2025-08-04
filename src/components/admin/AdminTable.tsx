import { FormatSiteName } from "@/utilities/FormatSiteName"
import Table from "../baseComponents/Table"

interface Props {
	// patientData is the object returned by the API
	users: user[]
	onClick?: (event: React.MouseEvent<HTMLTableRowElement>) => void
}

interface user {
	email: string
	role: string
	sites: string[]
	loginDate: string // Optional, as it may not be present in all user objects
}

const headers = ["Email", "Role", "Sites", "Last Login Time"]

function AdminTable({ users, onClick }: Props) {
	return (
		<Table
			data={users}
			headers={headers}
			emptyMessage="Error fetching data"
			renderRow={(user, i) => (
				<tr
					key={i}
					data-index={i}
					className={`hover:text-accent-content hover:bg-accent ${
						onClick ? "cursor-pointer" : ""
					}`}
					onClick={(event) => {
						if (onClick) {
							onClick(event)
						}
					}}
				>
					<td>{user.email}</td>
					<td>{FormatSiteName(user.role)}</td>
					<td className="flex flex-col">
						{["admin", "global-viewer"].includes(user.role) ? (
							<div>All</div>
						) : user.sites.length === 0 ? (
							<div>None</div>
						) : (
							user.sites.map((site) => (
								<div key={site}>{FormatSiteName(site)}</div>
							))
						)}
					</td>
					<td></td>
				</tr>
			)}
		/>
	)
}

export default AdminTable
