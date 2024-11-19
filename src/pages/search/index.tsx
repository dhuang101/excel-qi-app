import { useEffect, useState } from "react"
import {
	diagnosis_cardiac_options,
	diagnosis_resp_options,
	outcm_hosp_discharge_loc_options,
} from "@/constants/search/selectOptions"
import SearchTable from "../../components/search/SearchTable"
import axios from "axios"
import React from "react"
import DateRangeInput from "@/components/search/DateRangeInput"
import DropdownInput from "@/components/search/DropdownInput"

interface searchQuery {
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

function SearchPage() {
	const [searchQuery, setSearchQuery] = useState<searchQuery>({})
	const [searchResults, setSearchResults] = useState(null)

	// arrow function used to pipe input into event handler
	const handleSelectChange =
		(
			area:
				| "diagnosis_resp"
				| "diagnosis_cardiac"
				| "outcm_hosp_discharge_loc"
		) =>
		(event: React.ChangeEvent<HTMLSelectElement>) => {
			if ((event.target as HTMLSelectElement).value === "Any") {
				setSearchQuery((oldState) => {
					const { [area]: string, ...newState } = oldState // Destructure to exclude the key
					return newState
				})
			} else {
				setSearchQuery({
					...searchQuery,
					[area]: (event.target as HTMLSelectElement).value,
				})
			}
		}

	// similar for date input
	const handleDateChange =
		(area: "hospadm_date_time_after" | "hospadm_date_time_before") =>
		(event?: {
			$d: Date
			$y: number
			$M: number | undefined
			$D: number | undefined
			$H: number | undefined
			$m: number | undefined
		}) => {
			if (event) {
				if (!Number.isNaN(event.$d.getTime())) {
					const UtcDate = new Date(
						Date.UTC(
							event.$y,
							event.$M,
							event.$D,
							event.$H,
							event.$m
						)
					)
					setSearchQuery({
						...searchQuery,
						[area]: UtcDate,
					})
				}
			} else {
				if (area === "hospadm_date_time_after") {
					setSearchQuery((oldState) => {
						const {
							["hospadm_date_time_after"]: Date,
							...newState
						} = oldState // Destructure to exclude the key
						return newState
					})
				} else if (area === "hospadm_date_time_before") {
					setSearchQuery((oldState) => {
						const {
							["hospadm_date_time_before"]: Date,
							...newState
						} = oldState // Destructure to exclude the key
						return newState
					})
				}
			}
		}

	// event handler for search query
	function handleSearch() {
		axios
			.get("/api/database/getPatients", {
				params: searchQuery,
			})
			.then((result) => {
				setSearchResults(result.data)
			})
	}

	function handleBack() {
		setSearchResults(null)
	}

	useEffect(() => {
		console.log(searchQuery)
	}, [searchQuery])

	return (
		<div className="w-2/3 h-full">
			<article className="my-4 text-3xl font-semibold">
				Cohort Construction
			</article>
			{searchResults !== null ? (
				<React.Fragment>
					<button className="btn mb-4" onClick={handleBack}>
						Back
					</button>
					<SearchTable patientData={searchResults} />
				</React.Fragment>
			) : (
				<React.Fragment>
					<div className="flex flex-col w-full">
						<article className="mb-4 text-xl">
							Find patients with...
						</article>
						<div className="flex flex-col w-full">
							<DropdownInput
								title={"Respiratory Diagnosis"}
								handleSelectChange={handleSelectChange}
							/>
							<label className="form-control w-full max-w-xs">
								<div className="label">
									<span className="label-text">
										Cardiac Diagnosis
									</span>
								</div>
								<select
									className="select select-bordered"
									onChange={handleSelectChange(
										"diagnosis_cardiac"
									)}
								>
									{diagnosis_cardiac_options.map((value) => (
										<option key={value}>{value}</option>
									))}
								</select>
							</label>
							<label className="form-control w-full max-w-xs">
								<div className="label">
									<span className="label-text">
										Hospital Discharge Location
									</span>
								</div>
								<select
									className="select select-bordered"
									onChange={handleSelectChange(
										"outcm_hosp_discharge_loc"
									)}
								>
									{outcm_hosp_discharge_loc_options.map(
										(value) => (
											<option key={value}>{value}</option>
										)
									)}
								</select>
							</label>
							<article className="my-4 text-xl">
								Narrow By...
							</article>
							<div className="flex flex-col gap-y-4">
								<DateRangeInput
									title={"Hospital Admission Time"}
									handleDateChange={handleDateChange}
									queryAttribute={"hospadm_date_time"}
								/>
								<DateRangeInput
									title={"ICU Admission Time"}
									handleDateChange={handleDateChange}
									queryAttribute={"icuadm_date_time"}
								/>
								<DateRangeInput
									title={"ECMO Start Time"}
									handleDateChange={handleDateChange}
									queryAttribute={"ecmo_start_date_time"}
								/>
								<DateRangeInput
									title={"Decannulation Time"}
									handleDateChange={handleDateChange}
									queryAttribute={"decan_date_time"}
								/>
								<DateRangeInput
									title={"ICU Discharge Time"}
									handleDateChange={handleDateChange}
									queryAttribute={"outcm_icu_discharge"}
								/>
								<DateRangeInput
									title={"Hospital Discharge Time"}
									handleDateChange={handleDateChange}
									queryAttribute={"outcm_hosp_discharge"}
								/>
							</div>
						</div>
					</div>
					<div className="flex items-center">
						<button className="btn my-4" onClick={handleSearch}>
							Search
						</button>
						<article className="ml-12 text-error font-semibold"></article>
					</div>
				</React.Fragment>
			)}
			{/* footer */}
			<div className="h-16" />
		</div>
	)
}

export default SearchPage
