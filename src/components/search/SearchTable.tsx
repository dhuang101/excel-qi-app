import Table from "../baseComponents/Table"

const headers = [
	"Respiratory Diagnosis",
	"Cardiac Diagnosis",
	"ECMO Mode",
	"ECMO Indication",
	"Hospital Discharge Outcome",
]

interface Props {
	// patientData is the object returned by the API
	patientData: patientRecord[]
}

interface patientRecord {
	diagnosis_resp: string
	diagnosis_cardiac: string
	ecmo_mode: string
	ecmo_indication: string
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
					<td>{obj.diagnosis_resp}</td>
					<td>{obj.diagnosis_cardiac}</td>
					<td>{obj.ecmo_mode}</td>
					<td>{obj.ecmo_indication}</td>
					<td>{obj.outcm_hosp_discharge_loc}</td>
				</tr>
			)}
		/>
	)
}

export default SearchTable
