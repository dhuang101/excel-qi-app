// code for search results reducer
interface Action {
	type: ACTION
	payload?: any
}

export interface CountEntry {
	value: string
	count: number
}

export interface Counts {
	[key: string]: CountEntry[]
}

export interface CountDataItem {
	site: string
	totalDocuments: number
	counts: Counts
}

export interface LosStat {
	name: string
	count: number
	min: number
	q1: number
	median: number
	q3: number
	max: number
}

interface State {
	countData: CountDataItem[]
	losData: LosStat[]
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
