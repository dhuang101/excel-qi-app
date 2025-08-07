// type for the search query passed to mongo
export interface SearchQuery {
	role: string
	sites: string[]
	userEnteredQuery: UserEnteredQuery
}

// type for user adjustable data
export interface UserEnteredQuery {
	diagnosis_resp?: string
	diagnosis_cardiac?: string
	outcm_hosp_discharge_loc?: string
	hospadm_date_time_before?: Date
	hospadm_date_time_after?: Date
	icuadm_date_time_before?: Date
	icuadm_date_time_after?: Date
	ecmo_start_date_time_before?: Date
	ecmo_start_date_time_after?: Date
	decan_date_time_before?: Date
	decan_date_time_after?: Date
	outcm_icu_discharge_before?: Date
	outcm_icu_discharge_after?: Date
	outcm_hosp_discharge_before?: Date
	outcm_hosp_discharge_after?: Date
}
