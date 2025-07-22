import Table from "../baseComponents/Table"

interface Props {
	// patientData is the object returned by the API
	records: record[]
}

interface record {
	record_id: string
	redcap_data_access_group: string
	redcap_event_name: string
	birthdate: string
	sex: string
	height: string
	weight: string
	charlson_stroke: string
	charlson_dementia: string
	charlson_myocardial: string
	charlson_heartfailure: string
	charlson_peripheral_vd: string
	charlson_copd: string
	charlson_tissue: string
	charlson_peptic: string
	charlson_liver: string
	charlson_diabetes: string
	charlson_hemiplegia: string
	charlson_ckd: string
	charlson_malignancy: string
	charlson_leukaemia: string
	charlson_lymphoma: string
	charlson_aids: string
	charlson_score: string
	icuadm_cfs: string
	apache_score_c: string
	hospadm_date_time: Date
	icuadm_date_time: Date
	diagnosis_resp: string
	diagnosis_cardiac: string
	ecmo_start_date_time: Date
	decan_date_time: Date
	outcm_icu_discharge: Date
	outcm_hosp_discharge: Date
	outcm_hosp_discharge_loc: string
	outcm_ecmo_days_2: string
	outcm_icu_days: string
	outcm_hosp_days: string
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
					className="hover:text-accent-content hover:bg-accent"
				>
					<td className="sticky left-0 bg-base-100 z-index-2">
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
				</tr>
			)}
		/>
	)
}

export default ImportPreviewTable
