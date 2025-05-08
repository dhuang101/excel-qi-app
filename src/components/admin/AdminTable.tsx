import React from "react"

interface Props {
	// patientData is the object returned by the API
	users: user[]
}

interface user {
	email: string
	role: string
	sites: string[]
}

function AdminTable({ users }: Props) {
	// inner component to map over the users and display them in a table
	function TableRows() {
		function formatString(input: string): string {
			return input
				.replace(/[-_]/g, " ") // Replace - and _ with spaces
				.split(" ") // Split into words
				.map(
					(word) =>
						word.charAt(0).toUpperCase() +
						word.slice(1).toLowerCase()
				) // Capitalize each word
				.join(" ") // Join back into a string
		}

		return users.map((obj: user, i: number) => {
			return (
				<tr
					key={i}
					className="hover:text-accent-content hover:bg-accent"
				>
					<td>{obj.email}</td>
					<td>{formatString(obj.role)}</td>
					<td className="flex flex-col">
						{["admin", "global-viewer"].includes(obj.role) ? (
							<div>All</div>
						) : obj.sites.length === 0 ? (
							<div>None</div>
						) : (
							obj.sites.map((site) => {
								return <div>{formatString(site)}</div>
							})
						)}
					</td>
				</tr>
			)
		})
	}

	return (
		<React.Fragment>
			{users.length > 0 ? (
				<div className="overflow-x-auto">
					<table className="table table-lg w-full">
						<thead>
							<tr>
								<th className="bg-base-300">Email</th>
								<th className="bg-base-300">Role</th>
								<th className="bg-base-300">Sites</th>
							</tr>
						</thead>
						<tbody>
							<TableRows />
						</tbody>
					</table>
				</div>
			) : (
				<div className="flex flex-col justify-center items-center h-[89%]">
					<article className="text-3xl font-semibold pt-4">
						Error fetching data
					</article>
				</div>
			)}
		</React.Fragment>
	)
}

export default AdminTable
