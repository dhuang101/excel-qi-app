// code for reducer which handles data fetching on the summary statistics page
interface Action {
	type: ACTION
	payload?: any
}

export enum ACTION {
	SET_SITES,
	SET_YEARS,
	SET_ECMO_STATS,
	SET_GRAPH_DATA,
}

interface AgeData {
	ageRange: string
	value: number
}

interface CaseDeathData {
	ageRange: string
	totalCases: number
	totalDeaths: number
}

interface GenderData {
	gender: "Male" | "Female" | string
	percentOfTotal: number
	mortalityRate: number
}

// 2. Define the shape of the graph object
interface GraphMetrics {
	mortalityDist: AgeData[]
	caseDist: AgeData[]
	caseDeathDist: CaseDeathData[]
	genderDist: GenderData[]
}

export interface state {
	sites: string[]
	years: {
		[site: string]: number[]
	}
	ecmo_data: {
		[site: string]: {
			[mode: string]: number
		}
	}
	graph_data: {
		[siteId: string]: GraphMetrics
	}
}

export default function SummaryReducer(state: state, action: Action) {
	switch (action.type) {
		case ACTION.SET_SITES:
			return {
				...state,
				sites: action.payload,
			}
		case ACTION.SET_YEARS:
			return {
				...state,
				years: action.payload,
			}
		case ACTION.SET_ECMO_STATS:
			return {
				...state,
				ecmo_data: action.payload,
			}
		case ACTION.SET_GRAPH_DATA:
			return {
				...state,
				graph_data: action.payload,
			}
		default:
			return state
	}
}
