import React from "react"

interface Props {
	// patientData is the object returned by the API
	patientData: patientRecord[]
}

interface patientRecord {
	record_id: string
	diagnosis_resp: string
	diagnosis_cardiac: string
	outcm_hosp_discharge_loc: string
	hospadm_date_time: string
	icuadm_date_time: Date
	ecmo_start_date_time: Date
	decan_date_time: Date
	outcm_icu_discharge: Date
	outcm_hosp_discharge: Date
}

function SearchTable({ patientData }: Props) {
	function TableRows() {
		return patientData.map((obj: patientRecord, i: number) => {
			return (
				<tr
					key={i}
					className="hover:text-accent-content hover:bg-accent cursor-pointer"
				>
					<td>{obj.record_id}</td>
					<td>{obj.diagnosis_resp}</td>
					<td>{obj.diagnosis_cardiac}</td>
					<td>{obj.outcm_hosp_discharge_loc}</td>
					<td>
						{obj.hospadm_date_time
							? obj.hospadm_date_time
									.replace("T", " ")
									.slice(0, 16)
							: ""}
					</td>
				</tr>
			)
		})
	}

	return (
		<React.Fragment>
			{patientData.length > 0 ? (
				<div className="overflow-x-auto">
					<table className="table table-lg w-full">
						<thead>
							<tr>
								<th className="bg-base-300">Record ID</th>
								<th className="bg-base-300">
									Respiratory Diagnosis
								</th>
								<th className="bg-base-300">
									Cardiac Diagnosis
								</th>
								<th className="bg-base-300">
									Hospital Discharge Outcome
								</th>
								<th className="bg-base-300">
									Hospital Admission Time
								</th>
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
						No Patients With Values Inputted
					</article>
				</div>
			)}
		</React.Fragment>
	)
}

export default SearchTable
