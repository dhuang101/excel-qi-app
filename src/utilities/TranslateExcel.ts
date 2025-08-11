import dayjs from "dayjs"

// takes Redcap's exported data and translate fields from EXCEL dictionary where applicable
// Should be a object representing a single merged row from the exported EXCEL csv
export function TranslateExcel(currentRow: any, key: string) {
	if (
		key.includes("date_time") ||
		key === "outcm_icu_discharge" ||
		key === "outcm_hosp_discharge"
	) {
		currentRow[key] = dayjs(currentRow[key], "D/MM/YYYY H:mm").toDate()
	} else if (key === "diagnosis_resp") {
		const mapping = [
			"0",
			"ARDS (risk factor)",
			"Post lung transplant",
			"Direct lung trauma",
			"Pulmonary Vasculitis/Haemorrhage",
			"Focal lung disease (Not ARDS)",
			"Drug/Toxin pulmonary disease",
			"Asthma",
			"Chronic end stage lung disease",
			"N/A",
			"Management of airway obstruction",
		]
		currentRow[key] = mapping[parseInt(currentRow[key])]
	} else if (key === "diagnosis_cardiac") {
		const mapping = [
			"0",
			"Acute myocaridal infarction (AMI)",
			"Myocarditis",
			"Toxic",
			"Septic shock with myocardial depression",
			"Pulmonary embolism",
			"Advanced pulmonary hypertension",
			"Congential heart disease",
			'Primary arrhythmia ("Channelopathy")',
			"Chronic graft (heart) dysfunction",
			"Chronic cardiomyopathy no covered above",
			"Acute decompensated heart not covered above",
			"Peri-operative support",
			"N/A",
		]
		currentRow[key] = mapping[parseInt(currentRow[key])]
	} else if (key === "outcm_hosp_discharge_loc") {
		const mapping = [
			"0",
			"Home",
			"Transferred to another hospital",
			"Transfer to LTAC or rehab",
			"Transfer to hospice",
			"Dead",
			"Other",
		]
		currentRow[key] = mapping[parseInt(currentRow[key])]
	} else if (key === "icuadm_cfs") {
		const mapping = [
			"0",
			"Very fit",
			"Well",
			"Managing well",
			"Vulnerable",
			"Mildly frail",
			"Moderately frail",
			"Severly frail",
			"Extremely frail",
			"N/A",
		]
		currentRow[key] = mapping[parseInt(currentRow[key])]
	}
}
