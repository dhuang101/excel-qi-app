import { useContext, useEffect } from "react"
import { ACTION, GlobalContext } from "../contexts/GlobalStore"

function StateLoader({ children }: React.PropsWithChildren): JSX.Element {
	// global state access
	const [globalState, dispatch] = useContext(GlobalContext)

	useEffect(() => {
		// reload the theme from local storage if previously set
		let currentTheme = window.localStorage.getItem("theme")
		if (currentTheme !== null) {
			dispatch({ type: ACTION.UPDATE_THEME, payload: currentTheme })
		} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
			dispatch({ type: ACTION.UPDATE_THEME, payload: "dark" })
			window.localStorage.setItem("theme", "dark")
		} else {
			dispatch({ type: ACTION.UPDATE_THEME, payload: "light" })
			window.localStorage.setItem("theme", "light")
		}
	}, [])

	return globalState.theme === null ? (
		<div className="min-h-screen min-w-screen bg-slate-400" />
	) : (
		<div data-theme={globalState.theme}>{children}</div>
	)
}

export default StateLoader
