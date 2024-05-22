import { useContext } from "react"
import Link from "next/link"
import { ACTION, GlobalContext } from "@/contexts/GlobalStore"

import LightModeIcon from "@mui/icons-material/LightMode"
import DarkModeIcon from "@mui/icons-material/DarkMode"

function NavBar() {
	// global store access
	const [globalState, dispatch] = useContext(GlobalContext)

	function toggleTheme() {
		if (globalState.theme === "dark") {
			dispatch({ type: ACTION.UPDATE_THEME, payload: "light" })
			window.localStorage.setItem("theme", "light")
		} else {
			dispatch({ type: ACTION.UPDATE_THEME, payload: "dark" })
			window.localStorage.setItem("theme", "dark")
		}
	}

	return (
		<div className="navbar h-[7%] max-h-[64px] bg-primary">
			<div className="flex-1">
				<Link href={"/"}>
					<div className="btn btn-ghost normal-case rounded-xl text-xl text-primary-content">
						NICE Data Project
					</div>
				</Link>
			</div>
			<div className="btn btn-ghost rounded-xl" onClick={toggleTheme}>
				{globalState.theme === "light" ? (
					<LightModeIcon className="text-2xl text-primary-content" />
				) : (
					<DarkModeIcon className="text-2xl text-primary-content" />
				)}
			</div>
		</div>
	)
}

export default NavBar
