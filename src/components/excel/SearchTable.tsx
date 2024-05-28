interface Props {
	// patientData is the object returned by the API
	patientData: any
}

function SearchTable({ patientData }: Props) {
	function TableRows() {
		return patientData.map((obj: any, i: number) => {
			return (
				<tr
					key={i}
					className="hover:text-accent-content hover:bg-accent cursor-pointer"
				>
					<td>{obj.id}</td>
					<td>{obj.name}</td>
					<td>{obj.gender}</td>
					<td>{obj.birthDate}</td>
				</tr>
			)
		})
	}

	return (
		<div className="overflow-x-auto">
			<table className="table table-lg w-full">
				<thead>
					<tr>
						<th className="bg-base-300">ID</th>
						<th className="bg-base-300">Name</th>
						<th className="bg-base-300">Gender</th>
						<th className="bg-base-300">DoB</th>
					</tr>
				</thead>
				<tbody>
					<TableRows />
				</tbody>
			</table>
		</div>
	)
}

export default SearchTable
