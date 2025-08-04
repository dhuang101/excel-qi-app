import { useContext } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { ACTION, GlobalContext } from "@/store/GlobalStore"

import ASSETS from "@/assets/assets"
import PersonIcon from "@mui/icons-material/Person"
import LoginIcon from "@mui/icons-material/Login"
import LogoutIcon from "@mui/icons-material/Logout"
import LightModeIcon from "@mui/icons-material/LightMode"
import DarkModeIcon from "@mui/icons-material/DarkMode"

function NavBar() {
	// auth session
	const { data: session, status } = useSession()
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
		<div className="sticky top-0 bg-base-100 z-10">
			<div className="navbar">
				<div className="flex flex-1">
					<Link href={"/"}>
						<article className="btn btn-ghost rounded-xl ">
							<Image
								width={1672}
								height={971}
								src={ASSETS.logo}
								className="max-h-10 max-w-17 w-auto h-auto"
								alt="Logo"
							/>
							<article className="sm:text-sm xl:text-xl text-base-content normal-case ml-2 ">
								EXCEL QI
							</article>
						</article>
					</Link>
					<div className="flex ml-36 gap-x-2">
						<Link href={"/search"}>
							<article className="btn btn-ghost normal-case rounded-xl text-md text-base-content">
								Registry Search
							</article>
						</Link>
						<Link href={"/reporting"}>
							<article className="btn btn-ghost normal-case rounded-xl text-md text-base-content">
								Reporting
							</article>
						</Link>
						<Link href={"/ecmo-pal"}>
							<article className="btn btn-ghost normal-case rounded-xl text-md text-base-content">
								ECMO Prediction
							</article>
						</Link>
						<Link href={"/resources"}>
							<article className="btn btn-ghost normal-case rounded-xl text-md text-base-content">
								ECMO Resources
							</article>
						</Link>
						{(session?.user.role === "admin" ||
							session?.user.role === "global-viewer") && (
							<Link href={"/admin"}>
								<article className="btn btn-ghost normal-case rounded-xl text-md text-base-content">
									Admin Panel
								</article>
							</Link>
						)}
					</div>
				</div>
				<div className="btn btn-ghost rounded-xl" onClick={toggleTheme}>
					{globalState.theme === "light" ? (
						<LightModeIcon className="text-2xl text-base-content" />
					) : (
						<DarkModeIcon className="text-2xl text-base-content" />
					)}
				</div>
				{status === "authenticated" ? (
					<div className="ml-4 mr-6 dropdown dropdown-end text-base-content">
						<label
							tabIndex={0}
							className="btn btn-ghost rounded-btn"
						>
							<PersonIcon />
						</label>
						<ul
							tabIndex={0}
							className="menu dropdown-content z-1 p-2 shadow-sm rounded-box w-60 mt-4 bg-primary text-primary-content"
						>
							<article className="mx-2 my-2">
								Signed In As
								<br />
								<b>{session.user && session.user.email}</b>
							</article>
							<li>
								<a
									onClick={async () => {
										await signOut({ redirect: false })

										window.location.href = `${
											process.env.NEXT_PUBLIC_AUTH0_ISSUER
										}/v2/logout?client_id=${
											process.env
												.NEXT_PUBLIC_AUTH0_CLIENT_ID
										}&returnTo=${encodeURIComponent(
											window.location.origin
										)}`
									}}
								>
									<LogoutIcon />
									Sign Out
								</a>
							</li>
						</ul>
					</div>
				) : (
					<Link href={"/api/auth/signin"}>
						<div className="ml-4 mr-6 btn btn-ghost rounded-xl text-lg outline">
							<LoginIcon />
							Sign In
						</div>
					</Link>
				)}
			</div>
			<div className="divider divider-base-200 m-0 h-0"></div>
		</div>
	)
}

export default NavBar
