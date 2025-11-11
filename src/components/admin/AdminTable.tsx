import { FormatSiteName } from "@/utilities/FormatSiteName"
import Table from "../baseComponents/Table"

interface Props {
	// patientData is the object returned by the API
	users: user[]
	onClick?: (event: React.MouseEvent<HTMLTableRowElement>) => void
}

interface user {
	email: string
	name: string
	role: string
	redcap_data_access_group: string[]
	loginDate?: string
}

const headers = ["Name", "Email", "Role", "Sites", "Last Login Date"]

function AdminTable({ users, onClick }: Props) {
	function formatLoginDate(date?: string): string {
		if (!date) {
			return "N/A"
		} else {
			const splitDate = date.split("T")[0].split("-")
			return splitDate[2] + "/" + splitDate[1] + "/" + splitDate[0]
		}
	}

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
					<td>{user.name}</td>
					<td>{user.email}</td>
					<td>{FormatSiteName(user.role)}</td>
					<td className="flex flex-col">
						{["admin", "global-viewer"].includes(user.role) ? (
							<div>All</div>
						) : user.redcap_data_access_group.length === 0 ? (
							<div>None</div>
						) : (
							user.redcap_data_access_group.map((site) => (
								<div key={site}>{FormatSiteName(site)}</div>
							))
						)}
					</td>
					<td>{formatLoginDate(user.loginDate)}</td>
				</tr>
			)}
		/>
	)
}

export default AdminTable
