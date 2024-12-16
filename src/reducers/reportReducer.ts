// code for search results reducer
interface Action {
	type: ACTION
	payload?: any
}

interface State {
	totalDocuments: number
	attributes: Record<string, Count[]>
}

interface Count {
	_id: string
	count: number
}

export enum ACTION {
	SET_COUNTS,
}

export default function reportReducer(state: State, action: Action) {
	switch (action.type) {
		case ACTION.SET_COUNTS:
			return action.payload
		default:
			return state
	}
}
