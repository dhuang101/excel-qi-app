import dayjs from "dayjs"

// takes Redcap's exported data and translate fields from EXCEL dictionary where applicable
// Should be a object representing a single merged row from the exported EXCEL csv
export function TranslateExcel(currentRow: any, key: string) {
	if (
		key.includes("date_time") ||
		key === "outcm_icu_discharge" ||
		key === "outcm_hosp_discharge"
	) {
		const date = dayjs(currentRow[key], "D/MM/YYYY H:mm")
		if (!date.isValid()) {
			throw new Error(
				`Invalid date format at ${key}: "${currentRow[key]}"`,
			)
		}
		currentRow[key] = date.toDate()
		return
	}

	const mappings: Record<string, string[]> = {
		diagnosis_resp: [
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
		],
		diagnosis_cardiac: [
			"0",
			"Acute myocardial infarction (AMI)",
			"Myocarditis",
			"Toxic",
			"Septic shock with myocardial depression",
			"Pulmonary embolism",
			"Advanced pulmonary hypertension",
			"Congential heart disease",
			'Primary arrhythmia ("Channelopathy")',
			"Chronic graft (heart) dysfunction",
			"Chronic cardiomyopathy not covered above",
			"Acute decompensated heart not covered above",
			"Peri-operative support",
			"N/A",
		],
		outcm_hosp_discharge_loc: [
			"0",
			"Home",
			"Transferred to another hospital",
			"Transfer to LTAC or rehab",
			"Transfer to hospice",
			"Dead",
			"Other",
		],
		icuadm_cfs: [
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
		],
		ecmo_mode: [
			"Unknown",
			"V-A",
			"V-V",
			"V-VA",
			"A-VCO2R",
			"V-VECCO2R",
			"VP",
			"7",
			"8",
			"Other",
		],
		ecmo_indication: ["0", "Pulmonary", "Cardiac", "ECPR"],
	}

	if (mappings[key]) {
		const rawValue = currentRow[key]
		const index = parseInt(rawValue)
		const selectedMapping = mappings[key][index]

		if (isNaN(index) || selectedMapping === undefined) {
			throw new Error(
				`Invalid value "${rawValue}" for field "${key}". Expected a number between 0 and ${mappings[key].length - 1}.`,
			)
		}

		currentRow[key] = selectedMapping
	}
}
