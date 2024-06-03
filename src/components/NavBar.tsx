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
		<div className="flex flex-col">
			<div className="navbar h-[7%] max-h-[64px]">
				<div className="flex-1">
					<Link href={"/"}>
						<article className="btn btn-ghost normal-case rounded-xl text-xl text-base-content">
							NICE Data Project
						</article>
					</Link>
					<div className="flex ml-36 gap-x-2">
						<Link href={"/excel"}>
							<article className="btn btn-ghost normal-case rounded-xl text-md text-base-content">
								EXCEL Registry
							</article>
						</Link>
						<Link href={"/ecmo"}>
							<article className="btn btn-ghost normal-case rounded-xl text-md text-base-content">
								ECMO Outcomes
							</article>
						</Link>
						<Link href={"/virtual-trial"}>
							<article className="btn btn-ghost normal-case rounded-xl text-md text-base-content">
								Virtual Trial
							</article>
						</Link>
					</div>
				</div>
				<div></div>
				<div className="btn btn-ghost rounded-xl" onClick={toggleTheme}>
					{globalState.theme === "light" ? (
						<LightModeIcon className="text-2xl text-base-content" />
					) : (
						<DarkModeIcon className="text-2xl text-base-content" />
					)}
				</div>
			</div>
			<div className="divider divider-base-200 m-0 h-0 "></div>
		</div>
	)
}

export default NavBar
