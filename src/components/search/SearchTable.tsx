import Table from "../baseComponents/Table"

const headers = [
	"Record ID",
	"Respiratory Diagnosis",
	"Cardiac Diagnosis",
	"Hospital Discharge Outcome",
]

interface Props {
	// patientData is the object returned by the API
	patientData: patientRecord[]
}

interface patientRecord {
	record_id: string
	diagnosis_resp: string
	diagnosis_cardiac: string
	outcm_hosp_discharge_loc: string
}

function SearchTable({ patientData }: Props) {
	return (
		<Table
			data={patientData}
			headers={headers}
			emptyMessage="No Patients With Values Inputted"
			renderRow={(obj, i) => (
				<tr
					key={i}
					className="hover:text-accent-content hover:bg-accent"
				>
					<td>{obj.record_id}</td>
					<td>{obj.diagnosis_resp}</td>
					<td>{obj.diagnosis_cardiac}</td>
					<td>{obj.outcm_hosp_discharge_loc}</td>
				</tr>
			)}
		/>
	)
}

export default SearchTable
