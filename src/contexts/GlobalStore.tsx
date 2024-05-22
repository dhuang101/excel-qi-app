import { createContext, useReducer } from "react"

export enum ACTION {
	UPDATE_THEME,
}

export interface Action {
	type: ACTION
	payload: any
}

export interface State {
	theme: String | null
}

// https://fhirdb-monash.fhir-web-apps.cloud.edu.au/fhir/ for web server vm
const initialState: State = {
	theme: null,
}

function storeReducer(state: any, action: { type: any; payload: any }) {
	switch (action.type) {
		case ACTION.UPDATE_THEME:
			return {
				...state,
				theme: action.payload,
			}
		default:
			return state
	}
}

function GlobalStore({ children }: React.PropsWithChildren): JSX.Element {
	const [state, dispatch] = useReducer(storeReducer, initialState)

	return (
		<GlobalContext.Provider value={[state, dispatch]}>
			{children}
		</GlobalContext.Provider>
	)
}

export const GlobalContext = createContext<[State, React.Dispatch<Action>]>([
	initialState,
	() => {},
])

export default GlobalStore
