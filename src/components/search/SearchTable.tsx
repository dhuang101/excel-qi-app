import { useRouter } from "next/router"

interface Props {
	// patientData is the object returned by the API
	patientData: any
}

function SearchTable({ patientData }: Props) {
	const router = useRouter()

	function routeToSummary(resource: { record_id: string }) {
		router.push(`/search/` + resource.record_id)
	}

	function TableRows() {
		return patientData.map((obj: any, i: number) => {
			return (
				<tr
					key={i}
					className="hover:text-accent-content hover:bg-accent cursor-pointer"
					onClick={() => {
						routeToSummary(obj)
					}}
				>
					<td>{obj.record_id}</td>
					<td>{obj.sex}</td>
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
						<th className="bg-base-300">Sex</th>
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
