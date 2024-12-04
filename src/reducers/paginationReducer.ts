// code for pagination reducer
interface Action {
	type: ACTION
	payload: any
}

interface State {
	pageNum: number
	rowsPerPage: 10 | 25 | 50 | 100
}

export enum ACTION {
	UPDATE_PAGENUM,
	UPDATE_ROWSPERPAGE,
}

export default function paginationReducer(state: State, action: Action) {
	switch (action.type) {
		case ACTION.UPDATE_PAGENUM:
			return {
				pageNum: action.payload,
				rowsPerPage: state.rowsPerPage,
			}
		case ACTION.UPDATE_ROWSPERPAGE:
			return {
				pageNum: 0,
				rowsPerPage: action.payload,
			}
		default:
			return state
	}
}
