import { ChangeEvent, KeyboardEvent, useState } from "react"
import SearchTable from "../../components/search/SearchTable"
import axios from "axios"

function SearchPage() {
	const [searchInput, setSearchInput] = useState("")
	const [patientData, setPatientData] = useState([])

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
				setPatientData(result.data)
			})
	}

	return (
		<div className="w-7/12 h-full">
			<article className="my-4 text-3xl font-semibold">
				EXCEL Registry
			</article>
			<div className="flex flex-row">
				<input
					type="text"
					placeholder="Search By ID"
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
