// code for search results reducer
interface Action {
	type: ACTION
	payload?: any
}

interface AttributeValue {
	name: string
	value: number
}

interface Count {
	_id: string
	count: number
}

interface State {
	totalDocuments: number
	counts: Record<string, Count[]>
	losData: AttributeValue[]
}

export enum ACTION {
	SET_COUNTS,
	SET_LOS,
}

export default function reportReducer(state: State, action: Action) {
	switch (action.type) {
		case ACTION.SET_COUNTS:
			return {
				...state,
				...action.payload,
			}
		case ACTION.SET_LOS:
			return { ...state, losData: action.payload }
		default:
			return state
	}
}
