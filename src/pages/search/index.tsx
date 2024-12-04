import { ChangeEvent, useEffect, useRef, useState } from "react"
import SearchTable from "../../components/search/SearchTable"
import axios from "axios"
import React from "react"
import DateRangeInput from "@/components/search/DateRangeInput"
import DropdownInput from "@/components/search/DropdownInput"
import { keyToTitle } from "@/constants/search/keyToTitle"
import { CircularProgress, TablePagination } from "@mui/material"
import { DateStringFormatter } from "@/utilities/DateStringFormatter"

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
	const [searchResults, setSearchResults] = useState<Array<any> | null>(null)
	const [slicedResults, setSlicedResults] = useState<Array<any>>([])
	const [errorMessage, setErrorMessage] = useState("")
	const [pageNum, setPageNum] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(10)
	const [loading, setLoading] = useState(false)

	const modalRef = useRef<HTMLDialogElement>(null)
	// returns to query page
	function handleBack() {
		setSearchResults(null)
	}

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
		// form validation
		if (Object.keys(searchQuery).length === 0) {
			// no empty fields
			setErrorMessage("Error: No Fields Inputted")
		} else {
			// run search
			setLoading(true)
			axios
				.get("/api/database/getPatients", {
					params: searchQuery,
				})
				.then((result) => {
					setSearchResults(result.data)
					setSlicedResults(result.data.slice(0, 10))
				})
				.then(() => {
					setLoading(false)
				})
		}
	}

	// handles change of row count
	function handleChangeRowsPerPage(
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	): void {
		setPageNum(0)
		setRowsPerPage(parseInt(event.target.value)) // calls useEffect
	}

	// handles change of page
	function handleChangePage(
		event: React.MouseEvent<HTMLButtonElement> | null,
		page: number
	): void {
		setPageNum(page) // calls useEffect
	}

	useEffect(() => {
		if (searchResults !== null) {
			setSlicedResults(
				searchResults.slice(
					pageNum * rowsPerPage,
					pageNum * rowsPerPage + rowsPerPage
				)
			)
		}
		window.scrollTo(0, 0)
	}, [pageNum, rowsPerPage])

	// useEffect(() => {
	// 	console.log(searchQuery)
	// }, [searchQuery])

	return (
		<div className="flex flex-col flex-grow w-full items-center">
			<div className="w-2/3 h-full">
				<article className="my-4 text-3xl font-semibold">
					Cohort Construction
				</article>
				{loading === true ? (
					<div className="flex flex-col justify-center items-center h-[83vh]">
						<CircularProgress size={100} />
						<article className="text-lg font-semibold pt-4">
							Fetching Patients...
						</article>
					</div>
				) : searchResults !== null ? (
					<React.Fragment>
						<dialog ref={modalRef} className="modal">
							<div className="modal-box max-w-3xl">
								<article className="font-bold text-xl">
									Request Cohort Export
								</article>
								<div className="flex flex-col mt-4">
									<article className="font-semibold text-lg">
										Searched for Patients With
									</article>
									{Object.keys(searchQuery).map((key) => {
										let value =
											searchQuery[
												key as keyof searchQuery
											] instanceof Date
												? DateStringFormatter(
														searchQuery[
															key as keyof searchQuery
														] as Date
												  )
												: searchQuery[
														key as keyof searchQuery
												  ]?.toString()

										return (
											<div>
												{
													keyToTitle[
														key as keyof searchQuery
													]
												}
												: {value}
											</div>
										)
									})}
									<article className="mt-3">
										Total Cohort Size:{" "}
										{searchResults.length} patient(s)
									</article>
									<article className="font-semibold mt-3">
										Further Comments
									</article>
									<textarea className="textarea textarea-bordered mt-2"></textarea>
									<div>
										<button className="btn mt-2">
											Submit Request
										</button>
									</div>
								</div>
							</div>
							<form method="dialog" className="modal-backdrop">
								<button>close</button>
							</form>
						</dialog>
						<div className="flex w-full justify-between">
							<button className="btn mb-4" onClick={handleBack}>
								Back
							</button>
							<button
								className="btn mb-4"
								onClick={() => {
									modalRef.current!.showModal()
								}}
							>
								Export Cohort
							</button>
						</div>
						<SearchTable patientData={slicedResults} />
						<div className="flex flex-col items-center mt-8">
							<TablePagination
								component="div"
								count={searchResults.length}
								page={pageNum}
								onPageChange={handleChangePage}
								rowsPerPage={rowsPerPage}
								onRowsPerPageChange={handleChangeRowsPerPage}
								sx={{
									"& .MuiToolbar-root": {
										color: "oklch(var(--bc))",
									},
									"& .MuiSelect-icon": {
										color: "oklch(var(--bc))",
									},
									"& .MuiButtonBase-root": {
										"&.Mui-disabled": {
											color: "oklch(var(disabled))",
										},
									},
								}}
							/>
						</div>
					</React.Fragment>
				) : (
					<React.Fragment>
						<div className="flex flex-col w-full">
							<article className="mb-4 text-xl">
								Find patients with...
							</article>
							<div className="flex flex-col w-full">
								<DropdownInput
									title={"Primary Respiratory Diagnosis"}
									handleSelectChange={handleSelectChange}
									queryAttribute={"diagnosis_resp"}
								/>
								<DropdownInput
									title={"Primary Cardiac Diagnosis"}
									handleSelectChange={handleSelectChange}
									queryAttribute={"diagnosis_cardiac"}
								/>
								<DropdownInput
									title={"Discharge Outcome"}
									handleSelectChange={handleSelectChange}
									queryAttribute={"outcm_hosp_discharge_loc"}
								/>
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
							<article className="ml-12 text-error font-semibold">
								{errorMessage}
							</article>
						</div>
					</React.Fragment>
				)}
				{/* footer */}
				<div className="h-16" />
			</div>
		</div>
	)
}

export default SearchPage
