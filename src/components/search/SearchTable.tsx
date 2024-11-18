import { useRouter } from "next/router"

interface Props {
	// patientData is the object returned by the API
	patientData: any
}

function SearchTable({ patientData }: Props) {
	console.log(patientData)

	function TableRows() {
		return patientData.map((obj: any, i: number) => {
			return (
				<tr
					key={i}
					className="hover:text-accent-content hover:bg-accent cursor-pointer"
				>
					<td>{obj.record_id}</td>
					<td>{obj.hospadm_date_time}</td>
				</tr>
			)
		})
	}

	return (
		<div className="overflow-x-auto">
			<table className="table table-lg w-full">
				<thead>
					<tr>
						<th className="bg-base-300">Record ID</th>
						<th className="bg-base-300">Admission Time</th>
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
