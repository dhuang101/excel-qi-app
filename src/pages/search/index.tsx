import { ChangeEvent, useEffect, useReducer, useRef, useState } from "react"
import SearchTable from "../../components/search/SearchTable"
import axios from "axios"
import React from "react"
import DateRangeInput from "@/components/search/DateRangeInput"
import DropdownInput from "@/components/search/DropdownInput"
import { KEY_TO_TITLE } from "@/constants/search/keyToTitle"
import { CircularProgress, TablePagination } from "@mui/material"
import { FormatDate } from "@/utilities/FormatDate"
import searchReducer, { ACTION } from "@/reducers/searchReducer"
import ClusteredBarplot from "@/components/search/ClusteredBarplot"
import { useSession } from "next-auth/react"
import { FormatName } from "@/utilities/FormatName"
import { UserEnteredQuery } from "@/types/searchTypes"
import { useRouter } from "next/router"
import { SITE_NAMES } from "@/constants/sitesNames"
import DropdownMultiSelect from "@/components/search/DropdownMultiSelect"

// component
function SearchPage() {
	// auth session
	const { data: session, status } = useSession()
	// nextjs router
	const router = useRouter()

	// global store access
	const [state, dispatch] = useReducer(searchReducer, {
		searchResults: null,
		slicedResults: [],
		site: session?.user.sites?.at(0) as string,
		pageNum: 0,
		rowsPerPage: 10,
		graphKeys: [],
		graphDataResp: [],
		graphDataCardiac: [],
	})

	// presearch state
	const [userEnteredQuery, setUserEnteredQuery] = useState<UserEnteredQuery>({
		diagnosis_resp: [],
		diagnosis_cardiac: [],
		outcm_hosp_discharge_loc: [],
	})
	// selected site
	const [selectedSite, setSelectedSite] = useState(
		(session?.user.sites?.at(0) as string) || "all",
	)
	const [errorMessage, setErrorMessage] = useState("")
	// visualisations state
	const [showingVis, setShowingVis] = useState(false)
	const [width, setWidth] = useState(0)
	// loading
	const [loading, setLoading] = useState(false)

	const modalRef = useRef<HTMLDialogElement>(null)
	const graphContainer = useRef<HTMLDivElement | null>(null)

	// returns to query page
	function handleBack() {
		// reset page state
		setErrorMessage("")
		setShowingVis(false)
		setSelectedSite((session?.user.sites?.at(0) as string) || "all")
		setUserEnteredQuery({
			diagnosis_resp: [],
			diagnosis_cardiac: [],
			outcm_hosp_discharge_loc: [],
		})
		// dispatch to reset search state
		dispatch({ type: ACTION.RESET_RESULTS })
	}

	// toggles viewing of the clustered bar chart
	function handleToggleVis() {
		setShowingVis(!showingVis)
	}

	function handleSiteSelect(event: React.ChangeEvent<HTMLSelectElement>) {
		setSelectedSite(event.target.value)
	}

	// arrow function used to pipe input into event handler
	const handleSelectChange =
		(area: "ecmo_mode" | "ecmo_indication") =>
		(event: React.ChangeEvent<HTMLSelectElement>) => {
			if ((event.target as HTMLSelectElement).value === "Any") {
				setUserEnteredQuery((oldState) => {
					const { [area]: string, ...newState } = oldState
					return newState
				})
			} else {
				setUserEnteredQuery({
					...userEnteredQuery,
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
							event.$m,
						),
					)
					setUserEnteredQuery({
						...userEnteredQuery,
						[area]: UtcDate,
					})
				}
			} else {
				if (area === "hospadm_date_time_after") {
					setUserEnteredQuery((oldState) => {
						const {
							["hospadm_date_time_after"]: Date,
							...newState
						} = oldState
						return newState
					})
				} else if (area === "hospadm_date_time_before") {
					setUserEnteredQuery((oldState) => {
						const {
							["hospadm_date_time_before"]: Date,
							...newState
						} = oldState
						return newState
					})
				}
			}
		}

	// event handler for search query
	function handleSearch() {
		// form validation
		if (Object.keys(userEnteredQuery).length === 0) {
			// no empty fields
			setErrorMessage("Error: No Fields Inputted")
		} else {
			// run search
			setLoading(true)
			axios
				.post("/api/database/getPatients", {
					role: session?.user.role,
					sites: selectedSite,
					userEnteredQuery,
				})
				.then((result) => {
					window.scrollTo(0, 0)
					dispatch({
						type: ACTION.UPDATE_RESULTS,
						payload: result.data,
					})
				})
				.then(() => {
					setLoading(false)
				})
				.catch((error) => {
					console.error("Error 500", error)
					router.push("/error")
				})
		}
	}

	// handles change of row count
	function handleChangeRowsPerPage(
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	): void {
		dispatch({
			type: ACTION.UPDATE_ROWSPERPAGE,
			payload: parseInt(event.target.value),
		})
	}

	// handles change of page
	function handleChangePage(
		event: React.MouseEvent<HTMLButtonElement> | null,
		page: number,
	): void {
		dispatch({ type: ACTION.UPDATE_PAGENUM, payload: page }) // calls useEffect
	}

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [state])

	// dynamically assigns width variable to create responsive d3 graphs
	useEffect(() => {
		if (!graphContainer.current || !showingVis) {
			return
		}

		const resizeObserver = new ResizeObserver(() => {
			if (
				graphContainer.current?.offsetWidth !== width &&
				graphContainer.current !== null
			) {
				setWidth(graphContainer.current!.offsetWidth)
			}
		})

		if (graphContainer.current) {
			resizeObserver.observe(graphContainer.current)
		}

		return () => {
			resizeObserver.disconnect()
		}
	}, [showingVis, width])

	function handleMultiSelect(option: string, key: keyof UserEnteredQuery) {
		setUserEnteredQuery((prev) => {
			const currentValues = (prev[key] as string[]) || []
			const newValues = currentValues.includes(option)
				? currentValues.filter((v) => v !== option)
				: [...currentValues, option]

			return { ...prev, [key]: newValues }
		})
	}

	const handleSelectAll = (
		key: keyof UserEnteredQuery,
		options: string[],
	) => {
		setUserEnteredQuery((prev) => ({
			...prev,
			[key]: [...options],
		}))
	}

	const handleClearAll = (key: keyof UserEnteredQuery) => {
		setUserEnteredQuery((prev) => ({
			...prev,
			[key]: [],
		}))
	}

	return (
		<div className="flex flex-col grow w-full items-center">
			<div className="w-2/3 h-full">
				<article className="my-2 text-3xl font-semibold">
					Cohort Construction
				</article>
				{loading === true ? (
					<div className="flex flex-col justify-center items-center h-[83vh]">
						<CircularProgress size={100} />
						<article className="text-lg font-semibold pt-4">
							Fetching Patients...
						</article>
					</div>
				) : state.searchResults !== null ? (
					// search completed
					<React.Fragment>
						{/* dialog overlay for modal */}
						<dialog ref={modalRef} className="modal">
							<div className="modal-box max-w-3xl">
								<React.Fragment>
									<article className="font-bold text-xl">
										Request Cohort Export
									</article>
									<div className="flex flex-col mt-4">
										<article className="font-semibold text-lg">
											Searched for Patients With
										</article>
										{`Site: ${
											selectedSite === "all"
												? "All Sites"
												: FormatName(selectedSite)
										}`}{" "}
										{Object.keys(userEnteredQuery).map(
											(key) => {
												const rawValue =
													userEnteredQuery[
														key as keyof UserEnteredQuery
													]
												let value:
													| string
													| null
													| undefined

												if (Array.isArray(rawValue)) {
													if (rawValue.length === 0)
														return null
													value = rawValue.join(", ")
												} else if (
													rawValue instanceof Date
												) {
													value = FormatDate(rawValue)
												} else {
													value = rawValue?.toString()
												}
												if (
													value === null ||
													value === undefined
												)
													return null

												return (
													<div key={key}>
														{
															KEY_TO_TITLE[
																key as keyof UserEnteredQuery
															]
														}
														: {value}
													</div>
												)
											},
										)}
										<article className="my-3">
											Total Cohort Size:{" "}
											{state.searchResults.length}{" "}
											patient(s)
										</article>
										<article>
											Please send these details to the
											administrator of EXCEL to request an
											export of this cohort
										</article>
									</div>
								</React.Fragment>
							</div>
							<form method="dialog" className="modal-backdrop">
								<button>close</button>
							</form>
						</dialog>
						{/* rest of the page */}
						<div className="flex w-full justify-between mb-2">
							<button
								className="btn btn-primary"
								onClick={handleBack}
							>
								New Search
							</button>
							<button
								className="btn btn-primary"
								onClick={handleToggleVis}
							>
								{showingVis
									? "Close Graphs"
									: "Visualise Cohort"}
							</button>
							<button
								className="btn btn-primary"
								onClick={() => {
									modalRef.current!.showModal()
								}}
							>
								Export Cohort
							</button>
						</div>
						<div className="flex w-full items-center justify-between mb-2">
							<article className="w-2/3 text-md">
								{`Filters: ${[
									selectedSite === "all"
										? "All Sites"
										: FormatName(selectedSite),
									Array.isArray(
										userEnteredQuery.diagnosis_cardiac,
									)
										? userEnteredQuery.diagnosis_cardiac.join(
												", ",
											)
										: userEnteredQuery.diagnosis_cardiac,
									Array.isArray(
										userEnteredQuery.diagnosis_resp,
									)
										? userEnteredQuery.diagnosis_resp.join(
												", ",
											)
										: userEnteredQuery.diagnosis_resp,
									userEnteredQuery.ecmo_mode,
									userEnteredQuery.ecmo_indication,
								]
									.filter((v) => v && v.length > 0)
									.join(", ")}`}
							</article>
							{!showingVis && (
								<div className="flex items-center">
									<article className="text-sm w-24 mr-4">
										Rows Per Page:
									</article>
									<select
										className="select select-sm select-ghost w-20"
										value={state.rowsPerPage}
										onChange={(event) => {
											dispatch({
												type: ACTION.UPDATE_ROWSPERPAGE,
												payload: parseInt(
													event.target.value,
												),
											})
										}}
									>
										<option>10</option>
										<option>25</option>
										<option>50</option>
										<option>100</option>
									</select>
								</div>
							)}
						</div>
						{showingVis ? (
							<div className="flex flex-col items-center mt-4">
								<article className="font-semibold text-lg">
									Outcomes for Primary Respiratory Diagnoses
								</article>
								<div
									ref={graphContainer}
									className="flex justify-center w-[85vw]"
								>
									<ClusteredBarplot
										data={state.graphDataResp}
										keys={state.graphKeys}
										width={width}
										height={600}
									/>
								</div>
								<article className="font-semibold text-lg mt-16">
									Outcomes for Primary Cardiac Diagnoses
								</article>
								<div className="flex justify-center w-[85vw]">
									<ClusteredBarplot
										data={state.graphDataCardiac}
										keys={state.graphKeys}
										width={width}
										height={600}
									/>
								</div>
								{/* footer */}
								<div className="h-8" />
							</div>
						) : (
							<React.Fragment>
								<SearchTable
									patientData={state.slicedResults}
								/>
								<div className="flex flex-col items-center">
									<TablePagination
										component="div"
										count={state.searchResults.length}
										page={state.pageNum}
										onPageChange={handleChangePage}
										rowsPerPage={state.rowsPerPage}
										onRowsPerPageChange={
											handleChangeRowsPerPage
										}
										sx={{
											"& .MuiToolbar-root": {
												color: "var(--color-base-content)",
											},
											"& .MuiSelect-icon": {
												color: "var(--color-base-content)",
											},
											"& .MuiButtonBase-root": {
												"&.Mui-disabled": {
													color: "var(disabled))",
												},
											},
										}}
									/>
								</div>
							</React.Fragment>
						)}
					</React.Fragment>
				) : (
					// search page
					<React.Fragment>
						<div className="flex flex-col w-full">
							<article className="mb-2 text-xl">
								Select site to search
							</article>
							<label className="form-control w-1/4">
								<select
									className="select w-full"
									onChange={handleSiteSelect}
								>
									{session?.user.role === "admin" ||
									session?.user.role === "global-viewer" ? (
										<React.Fragment>
											<option value="all">
												All Sites
											</option>
											{SITE_NAMES.map((value) => (
												<option
													key={value}
													value={value}
												>
													{FormatName(value)}
												</option>
											))}
										</React.Fragment>
									) : (
										session?.user.sites.map((value) => (
											<option key={value} value={value}>
												{FormatName(value)}
											</option>
										))
									)}
								</select>
							</label>
							<article className="mt-4 mb-2 text-xl">
								Patient attributes
							</article>
							<div className="flex flex-col w-full">
								<div className="flex flex-col w-1/4 gap-y-2">
									<DropdownMultiSelect
										title="Primary Respiratory Diagnosis"
										selectedValues={
											userEnteredQuery.diagnosis_resp as string[]
										}
										queryKey="diagnosis_resp"
										onSelect={handleMultiSelect}
										onSelectAll={handleSelectAll}
										onClearAll={handleClearAll}
									/>
									<DropdownMultiSelect
										title="Hospital Discharge Location"
										selectedValues={
											userEnteredQuery.outcm_hosp_discharge_loc as string[]
										}
										queryKey="outcm_hosp_discharge_loc"
										onSelect={handleMultiSelect}
										onSelectAll={handleSelectAll}
										onClearAll={handleClearAll}
									/>
									<DropdownMultiSelect
										title="Primary Cardiac Diagnosis"
										selectedValues={
											userEnteredQuery.diagnosis_cardiac as string[]
										}
										queryKey="diagnosis_cardiac"
										onSelect={handleMultiSelect}
										onSelectAll={handleSelectAll}
										onClearAll={handleClearAll}
									/>
									<DropdownInput
										title={"ECMO Mode"}
										handleSelectChange={handleSelectChange}
										queryAttribute={"ecmo_mode"}
									/>
									<DropdownInput
										title={"ECMO Indication"}
										handleSelectChange={handleSelectChange}
										queryAttribute={"ecmo_indication"}
									/>
								</div>

								<div className="flex flex-col gap-y-3 mt-2">
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
							<button
								className="btn btn-primary my-4"
								onClick={handleSearch}
							>
								Search
							</button>
							<article className="ml-12 text-error font-semibold">
								{errorMessage}
							</article>
						</div>
					</React.Fragment>
				)}
			</div>
		</div>
	)
}

export default SearchPage
