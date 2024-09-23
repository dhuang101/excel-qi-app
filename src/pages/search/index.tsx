import { ChangeEvent, KeyboardEvent, useState } from "react"
import SearchTable from "../../components/search/SearchTable"
import { testPatients } from "@/test-data/patients"
import axios from "axios"

function SearchPage() {
	const [searchOption, setSearchOption] = useState("name")
	const [searchInput, setSearchInput] = useState("")
	const [patientData, setPatientData] = useState(testPatients)

	// function that handles change in search option
	function handleSelect(event: ChangeEvent<HTMLSelectElement>): void {
		setSearchOption(event.target.value)
	}
	// function that handles input in the search box
	function handleInput(event: ChangeEvent<HTMLInputElement>) {
		setSearchInput(event.target.value)
	}
	// searches on enter press
	function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter") {
			handleSearch()
		}
	}

	function handleSearch() {
		axios
			.get("/api/database/getPatients", {
				params: {
					searchInput: searchInput,
				},
			})
			.then((result) => {
				console.log(result.data)
			})
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
					onKeyDown={handleKeyDown}
					onChange={handleInput}
				/>
				<button
					onClick={handleSearch}
					className="ml-2 btn rounded btn-primary"
				>
					Search
				</button>
			</div>
			<div className="mt-2">
				<SearchTable patientData={patientData} />
			</div>
		</div>
	)
}

export default SearchPage
