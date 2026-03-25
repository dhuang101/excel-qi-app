// code for search results reducer
interface Action {
	type: ACTION
	payload?: any
}

interface State {
	searchResults: any[] | null
	slicedResults: any[]
	site: string
	pageNum: number
	rowsPerPage: 10 | 25 | 50 | 100
	graphKeys: any[]
	graphDataResp: any[]
	graphDataCardiac: any[]
}

export enum ACTION {
	UPDATE_SITE,
	UPDATE_PAGENUM,
	UPDATE_ROWSPERPAGE,
	UPDATE_RESULTS,
	RESET_RESULTS,
}

interface OutputRow {
	category: string
	[location: string]: number | string
}

export default function searchReducer(state: State, action: Action) {
	switch (action.type) {
		case ACTION.UPDATE_SITE:
			return {
				...state,
				site: action.payload,
			}
		case ACTION.UPDATE_PAGENUM:
			return {
				...state,
				pageNum: action.payload,
				slicedResults: state.searchResults!.slice(
					action.payload * state.rowsPerPage,
					action.payload * state.rowsPerPage + state.rowsPerPage
				),
			}
		case ACTION.UPDATE_ROWSPERPAGE:
			return {
				...state,
				rowsPerPage: action.payload,
				slicedResults: state.searchResults!.slice(
					state.pageNum * action.payload,
					state.pageNum * action.payload + action.payload
				),
			}
		case ACTION.UPDATE_RESULTS:
			// generate data for the graphs
			const keys = [
				...new Set(
					action.payload.map(
						(item: { outcm_hosp_discharge_loc: any }) =>
							item.outcm_hosp_discharge_loc
					)
				),
			]

			function createGraphData(
				type: "diagnosis_resp" | "diagnosis_cardiac"
			) {
				// aggregate for counting outcome against respiratory diagnosis
				const grouped = action.payload.reduce(
					(
						acc: { [x: string]: { [x: string]: number } },
						record: {
							diagnosis_cardiac: any
							diagnosis_resp: any
							outcm_hosp_discharge_loc: any
						}
					) => {
						const diagnosis = record[type]
						const loc = record.outcm_hosp_discharge_loc

						// Ensure the diagnosis exists in the accumulator
						if (!acc[diagnosis]) {
							acc[diagnosis] = {}
						}

						// Count occurrences of each location
						if (!acc[diagnosis][loc]) {
							acc[diagnosis][loc] = 0
						}
						acc[diagnosis][loc]++

						return acc
					},
					{}
				)

				// transform grouped data into the desired array format
				return Object.entries(grouped).map(([diagnosis, locations]) => {
					const locs = locations as Record<string, number>
					const row: OutputRow = { category: diagnosis }
					for (const [loc, count] of Object.entries(locs)) {
						row[loc] = count
					}
					return row
				})
			}

			return {
				...state,
				searchResults: action.payload,
				slicedResults: action.payload.slice(0, 10),
				graphKeys: keys,
				graphDataResp: createGraphData("diagnosis_resp"),
				graphDataCardiac: createGraphData("diagnosis_cardiac"),
			}
		case ACTION.RESET_RESULTS:
			return {
				...state,
				searchResults: null,
				pageNum: 0,
			}
		default:
			return state
	}
}
