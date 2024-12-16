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
	SET_SUMMARY,
}

export default function reportReducer(state: State, action: Action) {
	switch (action.type) {
		case ACTION.SET_SUMMARY:
			return action.payload
		default:
			return state
	}
}
