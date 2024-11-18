import { useEffect, useState } from "react"
import SearchTable from "../../components/search/SearchTable"
import axios from "axios"
import StyledDateTimePicker from "@/components/StyledDateTimePicker"

interface searchQuery {
	diagnosis_resp?: string
	diagnosis_cardiac?: string
	outcm_hosp_discharge_loc?: string
	hospadm_date_time_before?: Date
	hospadm_date_time_after?: Date
}

function SearchPage() {
	const [searchQuery, setSearchQuery] = useState<searchQuery>({})

	// arrow function used to pipe input into event handler
	const handleSelectChange =
		(
			area:
				| "diagnosis_resp"
				| "diagnosis_cardiac"
				| "outcm_hosp_discharge_loc"
		) =>
		(event: React.ChangeEvent<HTMLSelectElement>) => {
			setSearchQuery({
				...searchQuery,
				[area]: (event.target as HTMLSelectElement).value,
			})
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
				// console.log(result)
			})
	}

	// useEffect(() => {
	// 	console.log(searchQuery)
	// }, [searchQuery])

	return (
		<div className="w-7/12 h-full">
			<article className="my-4 text-3xl font-semibold">
				Cohort Construction
			</article>
			<div className="flex flex-col w-full">
				<article className="mb-4 text-xl">
					Find patients with...
				</article>
				<div className="flex flex-col w-full">
					<label className="form-control w-full max-w-xs">
						<div className="label">
							<span className="label-text">
								Respiratory Diagnosis
							</span>
						</div>
						<select
							className="select select-bordered"
							onChange={handleSelectChange("diagnosis_resp")}
							defaultValue={0}
						>
							<option disabled value={0}>
								(Optional)
							</option>
							<option>ARDS (risk factor)</option>
							<option>Post lung transplant</option>
							<option>Direct lung trauma</option>
							<option>Pulmonary Vasculitis/Haemorrhage</option>
							<option>Focal lung disease (Not ARDS)</option>
							<option>Drug/Toxin pulmonary disease</option>
							<option>Asthma</option>
							<option>Chronic end stage lung disease</option>
							<option>N/A</option>
						</select>
					</label>
					<label className="form-control w-full max-w-xs">
						<div className="label">
							<span className="label-text">
								Cardiac Diagnosis
							</span>
						</div>
						<select
							className="select select-bordered"
							onChange={handleSelectChange("diagnosis_cardiac")}
							defaultValue={0}
						>
							<option disabled value={0}>
								(Optional)
							</option>
							<option>Acute myocaridal infarction (AMI)</option>
							<option>Myocarditis</option>
							<option>Toxic</option>
							<option>
								Septic shock with myocardial depression
							</option>
							<option>Pulmonary embolism</option>
							<option>Advanced pulmonary hypertension</option>
							<option>Congential heart disease</option>
							<option>
								Primary arrhythmia ("Channelopathy")
							</option>
							<option>Chronic graft (heart) dysfunction</option>
							<option>
								Chronic cardiomyopathy no covered above
							</option>
							<option>
								Acute decompensated heart not covered above
							</option>
							<option>Peri-operative support</option>
							<option>N/A</option>
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
							defaultValue={0}
						>
							<option disabled value={0}>
								(Optional)
							</option>
							<option>Home</option>
							<option>Transferred to another hospital</option>
							<option>Transfer to LTAC or rehab</option>
							<option>Transfer to hospice</option>
							<option>Dead</option>
							<option>Other</option>
							<option>N/A</option>
						</select>
					</label>
					<article className="my-4 text-xl">Narrow By...</article>
					<article className="mb-4 text-sm">
						Hospital Admission Time
					</article>
					<div className="flex w-full">
						<div className="w-1/3">
							<StyledDateTimePicker
								label="After"
								onChange={handleDateChange(
									"hospadm_date_time_after"
								)}
							/>
						</div>
						<div className="w-1/12" />
						<div className="w-1/3">
							<StyledDateTimePicker
								label="Before"
								onChange={handleDateChange(
									"hospadm_date_time_before"
								)}
							/>
						</div>
					</div>
				</div>
			</div>
			<button className="btn my-4" onClick={handleSearch}>
				Search
			</button>
			{/* footer */}
			<div className="h-16" />
		</div>
	)
}

export default SearchPage
