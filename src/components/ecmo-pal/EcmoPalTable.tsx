import Table from "../baseComponents/Table"

const headers = ["Record ID"]

interface Props {
	// patientData is the object returned by the API
	patientData: patientRecord[]
	onClick?: (event: React.MouseEvent<HTMLTableRowElement>) => void
}

interface patientRecord {
	record_id: string
}

function EcmoPalTable({ patientData, onClick }: Props) {
	return (
		<Table
			data={patientData}
			headers={headers}
			emptyMessage="No Patients With Values Inputted"
			renderRow={(obj, i) => (
				<tr
					key={i}
					className={`hover:text-accent-content hover:bg-accent ${
						onClick ? "cursor-pointer" : ""
					}`}
					onClick={(event) => {
						if (onClick) {
							onClick(event)
						}
					}}
				>
					<td>{obj.record_id}</td>
				</tr>
			)}
		/>
	)
}

export default EcmoPalTable
