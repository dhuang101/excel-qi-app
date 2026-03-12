import Table from "../baseComponents/Table"
import { excelImportRow } from "@/types/excelImportTypes"

interface Props {
	// patientData is the object returned by the API
	records: excelImportRow[]
}

const headers = [
	"Record ID",
	"Birthdate",
	"Sex",
	"Height",
	"Weight",
	"Charlson Stroke",
	"Charlson Dementia",
	"Charlson Myocardial",
	"Charlson Heart Failure",
	"Charlson Peripheral Vascular Disease",
	"Charlson COPD",
	"Charlson Tissue",
	"Charlson Peptic",
	"Charlson Liver",
	"Charlson Diabetes",
	"Charlson Hemiplegia",
	"Charlson CKD",
	"Charlson Malignancy",
	"Charlson Leukaemia",
	"Charlson Lymphoma",
	"Charlson AIDS",
	"Charlson Score",
	"ICU Admission CFS",
	"Apache Score C",
	"Hospital Admission Date and Time",
	"ICU Admission Date and Time",
	"Diagnosis (Respiratory)",
	"Diagnosis (Cardiac)",
	"ECMO Start Date and Time",
	"Decannulation Date and Time",
	"ICU Discharge Date and Time",
	"Hospital Discharge Date and Time",
	"Hospital Discharge Outcome",
	"Days on ECMO",
	"Days in ICU",
	"Days in Hospital",
	"Renal Replacement Therapy",
]

function ImportPreviewTable({ records }: Props) {
	return (
		<Table
			data={records}
			headers={headers}
			emptyMessage="Error parsing csv data"
			renderRow={(record, i) => (
				<tr
					key={record.record_id}
					data-index={record.record_id}
					className="group hover:bg-accent hover:text-accent-content"
				>
					<td className="sticky left-0 z-10 bg-base-100 group-hover:bg-accent group-hover:text-accent-content">
						{record.record_id}
					</td>
					<td>{record.birthdate}</td>
					<td>{record.sex}</td>
					<td>{record.height}</td>
					<td>{record.weight}</td>
					<td>{record.charlson_stroke}</td>
					<td>{record.charlson_dementia}</td>
					<td>{record.charlson_myocardial}</td>
					<td>{record.charlson_heartfailure}</td>
					<td>{record.charlson_peripheral_vd}</td>
					<td>{record.charlson_copd}</td>
					<td>{record.charlson_tissue}</td>
					<td>{record.charlson_peptic}</td>
					<td>{record.charlson_liver}</td>
					<td>{record.charlson_diabetes}</td>
					<td>{record.charlson_hemiplegia}</td>
					<td>{record.charlson_ckd}</td>
					<td>{record.charlson_malignancy}</td>
					<td>{record.charlson_leukaemia}</td>
					<td>{record.charlson_lymphoma}</td>
					<td>{record.charlson_aids}</td>
					<td>{record.charlson_score}</td>
					<td>{record.icuadm_cfs}</td>
					<td>{record.apache_score_c}</td>
					<td>{record.hospadm_date_time.toLocaleString()}</td>
					<td>{record.icuadm_date_time.toLocaleString()}</td>
					<td>{record.diagnosis_resp}</td>
					<td>{record.diagnosis_cardiac}</td>
					<td>{record.ecmo_start_date_time.toLocaleString()}</td>
					<td>{record.decan_date_time.toLocaleString()}</td>
					<td>{record.outcm_icu_discharge.toLocaleString()}</td>
					<td>{record.outcm_hosp_discharge.toLocaleString()}</td>
					<td>{record.outcm_hosp_discharge_loc}</td>
					<td>{record.outcm_ecmo_days_2}</td>
					<td>{record.outcm_icu_days}</td>
					<td>{record.outcm_hosp_days}</td>
					<td>{record.rrt}</td>
				</tr>
			)}
		/>
	)
}

export default ImportPreviewTable
