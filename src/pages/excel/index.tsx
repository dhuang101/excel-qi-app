import { ChangeEvent, useState } from "react"
import SearchTable from "../../components/excel/SearchTable"
import { testPatients } from "@/test-data/patients"

function ExcelPage() {
	const [searchOption, setSearchOption] = useState("name")
	const [patientData, setPatientData] = useState(testPatients)

	// function that handles input in the search box
	function handleSelect(event: ChangeEvent<HTMLSelectElement>): void {
		setSearchOption(event.target.value)
	}

	return (
		<div className="w-7/12 h-full">
			<article className="mt-4 text-3xl font-semibold">
				EXCEL Registry
			</article>
			<div className="my-3">
				<select
					className="select select-bordered select-sm max-w-xs"
					onChange={handleSelect}
					value={searchOption}
				>
					<option value={"name"}>Search By Name</option>
					<option value={"id"}>Search By ID</option>
				</select>
			</div>
			<div className="flex flex-row">
				<input
					type="text"
					placeholder="Enter Query"
					className="input input-bordered w-full max-w-sm"
				/>
				<button className="ml-2 btn rounded btn-primary">Search</button>
			</div>
			<div className="mt-2">
				<SearchTable patientData={patientData} />
			</div>
		</div>
	)
}

export default ExcelPage
