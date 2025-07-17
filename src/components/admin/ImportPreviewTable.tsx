import { FormatSiteName } from "@/utilities/FormatSiteName"
import Table from "../baseComponents/Table"

interface Props {
	// patientData is the object returned by the API
	records: record[]
}

interface record {
	record_id: string
}

const headers = ["Record ID", "Role", "Sites"]

function ImportPreviewTable({ records }: Props) {
	return (
		<Table
			data={records}
			headers={headers}
			emptyMessage="Error parsing csv data"
			renderRow={(record, i) => (
				<tr
					key={i}
					data-index={i}
					className="hover:text-accent-content hover:bg-accent"
				>
					<td>{record.record_id}</td>
				</tr>
			)}
		/>
	)
}

export default ImportPreviewTable
