import { ARDS_COMPLICATIONS_MAP } from "@/constants/reporting/ardsComplications"
import Table from "../baseComponents/Table"
import { excelImportRow } from "@/types/excelImportTypes"

interface Props {
	records: excelImportRow[]
}

const baseHeaders = [
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

const complicationHeaders = Object.values(ARDS_COMPLICATIONS_MAP)
const allHeaders = [...baseHeaders, ...complicationHeaders]

const complicationKeys = Object.keys(ARDS_COMPLICATIONS_MAP)

function ImportPreviewTable({ records }: Props) {
	return (
		<Table
			data={records}
			headers={allHeaders}
			emptyMessage="Error parsing csv data"
			renderRow={(record, i) => (
				<tr
					key={record.record_id}
					className="group hover:bg-accent hover:text-accent-content transition-colors"
				>
					<td className="sticky left-0 z-2 bg-base-100 group-hover:bg-accent group-hover:text-accent-content transition-colors font-semibold border-r border-base-300">
						{record.record_id}
					</td>

					<td className="border-r border-base-300">
						{record.birthdate}
					</td>
					<td className="border-r border-base-300">{record.sex}</td>
					<td className="border-r border-base-300">
						{record.height}
					</td>
					<td className="border-r border-base-300">
						{record.weight}
					</td>
					<td className="border-r border-base-300">
						{record.charlson_stroke}
					</td>
					<td className="border-r border-base-300">
						{record.charlson_dementia}
					</td>
					<td className="border-r border-base-300">
						{record.charlson_myocardial}
					</td>
					<td className="border-r border-base-300">
						{record.charlson_heartfailure}
					</td>
					<td className="border-r border-base-300">
						{record.charlson_peripheral_vd}
					</td>
					<td className="border-r border-base-300">
						{record.charlson_copd}
					</td>
					<td className="border-r border-base-300">
						{record.charlson_tissue}
					</td>
					<td className="border-r border-base-300">
						{record.charlson_peptic}
					</td>
					<td className="border-r border-base-300">
						{record.charlson_liver}
					</td>
					<td className="border-r border-base-300">
						{record.charlson_diabetes}
					</td>
					<td className="border-r border-base-300">
						{record.charlson_hemiplegia}
					</td>
					<td className="border-r border-base-300">
						{record.charlson_ckd}
					</td>
					<td className="border-r border-base-300">
						{record.charlson_malignancy}
					</td>
					<td className="border-r border-base-300">
						{record.charlson_leukaemia}
					</td>
					<td className="border-r border-base-300">
						{record.charlson_lymphoma}
					</td>
					<td className="border-r border-base-300">
						{record.charlson_aids}
					</td>
					<td className="border-r border-base-300">
						{record.charlson_score}
					</td>
					<td className="border-r border-base-300">
						{record.icuadm_cfs}
					</td>
					<td className="border-r border-base-300">
						{record.apache_score_c}
					</td>
					<td className="border-r border-base-300">
						{record.hospadm_date_time?.toLocaleString()}
					</td>
					<td className="border-r border-base-300">
						{record.icuadm_date_time?.toLocaleString()}
					</td>
					<td className="border-r border-base-300">
						{record.diagnosis_resp}
					</td>
					<td className="border-r border-base-300">
						{record.diagnosis_cardiac}
					</td>
					<td className="border-r border-base-300">
						{record.ecmo_start_date_time?.toLocaleString()}
					</td>
					<td className="border-r border-base-300">
						{record.decan_date_time?.toLocaleString()}
					</td>
					<td className="border-r border-base-300">
						{record.outcm_icu_discharge?.toLocaleString()}
					</td>
					<td className="border-r border-base-300">
						{record.outcm_hosp_discharge?.toLocaleString()}
					</td>
					<td className="border-r border-base-300">
						{record.outcm_hosp_discharge_loc}
					</td>
					<td className="border-r border-base-300">
						{record.outcm_ecmo_days_2}
					</td>
					<td className="border-r border-base-300">
						{record.outcm_icu_days}
					</td>
					<td className="border-r border-base-300">
						{record.outcm_hosp_days}
					</td>

					{/* 3. Dynamic Complication Columns with border-r and 0 default */}
					{complicationKeys.map((key) => {
						const val = (record as any)[key]
						const displayValue =
							val === null || val === undefined || val === ""
								? 0
								: val

						return (
							<td key={key} className="border-r border-base-300">
								{displayValue}
							</td>
						)
					})}
				</tr>
			)}
		/>
	)
}

export default ImportPreviewTable
