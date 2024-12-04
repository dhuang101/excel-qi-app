// code for search results reducer
interface Action {
	type: ACTION
	payload?: any
}

interface State {
	searchResults?: any[] | null
	slicedResults?: any[]
	pageNum: number
	rowsPerPage: 10 | 25 | 50 | 100
}

export enum ACTION {
	UPDATE_PAGENUM,
	UPDATE_ROWSPERPAGE,
	UPDATE_RESULTS,
	RESET_RESULTS,
}

export default function searchReducer(state: State, action: Action) {
	switch (action.type) {
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
			return {
				...state,
				searchResults: action.payload,
				slicedResults: action.payload.slice(0, 10),
			}
		case ACTION.RESET_RESULTS:
			return {
				...state,
				searchResults: null,
			}
		default:
			return state
	}
}
