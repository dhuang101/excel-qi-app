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
import MenuIcon from "@mui/icons-material/Menu"

function NavBar() {
	const { data: session, status } = useSession()
	const [globalState, dispatch] = useContext(GlobalContext)

	function toggleTheme() {
		const newTheme = globalState.theme === "dark" ? "light" : "dark"
		dispatch({ type: ACTION.UPDATE_THEME, payload: newTheme })
		window.localStorage.setItem("theme", newTheme)
	}

	const NavLinks = () => (
		<>
			<Link href="/summary">
				<article className="btn btn-ghost normal-case rounded-xl text-base-content">
					Summary Statistics
				</article>
			</Link>
			<Link href="/search">
				<article className="btn btn-ghost normal-case rounded-xl text-base-content">
					Registry Search
				</article>
			</Link>
			<Link href="/reporting">
				<article className="btn btn-ghost normal-case rounded-xl text-base-content">
					Reporting
				</article>
			</Link>
			<Link href="/ecmo-pal">
				<article className="btn btn-ghost normal-case rounded-xl text-base-content">
					ECMO Prediction
				</article>
			</Link>
			<Link href="/file-repo">
				<article className="btn btn-ghost normal-case rounded-xl text-base-content">
					File Repository
				</article>
			</Link>
			<Link href="/resources">
				<article className="btn btn-ghost normal-case rounded-xl text-base-content">
					ECMO Resources
				</article>
			</Link>
			{(session?.user.role === "admin" ||
				session?.user.role === "global-viewer") && (
				<Link href="/admin">
					<article className="btn btn-ghost normal-case rounded-xl text-base-content">
						Admin Panel
					</article>
				</Link>
			)}
		</>
	)

	return (
		<div className="sticky top-0 bg-base-100 z-20">
			<div className="navbar px-2 md:px-4">
				<div className="navbar-start">
					<div className="dropdown lg:hidden">
						<label
							tabIndex={0}
							className="btn btn-ghost btn-circle"
						>
							<MenuIcon />
						</label>
						<ul
							tabIndex={0}
							className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 border border-base-200"
						>
							<NavLinks />
						</ul>
					</div>

					<Link href={"/"} className="flex items-center">
						<div className="btn btn-ghost rounded-xl px-2">
							<Image
								width={1672}
								height={971}
								src={ASSETS.logo}
								className="max-h-8 md:max-h-10 w-auto h-auto"
								alt="Logo"
							/>
							<article className="hidden sm:block text-sm xl:text-xl text-base-content normal-case ml-2">
								EXCEL QI
							</article>
						</div>
					</Link>
				</div>

				<div className="navbar-start hidden lg:flex">
					<div className="flex gap-x-1">
						<NavLinks />
					</div>
				</div>

				<div className="navbar-end gap-1">
					<div
						className="btn btn-ghost lg:mr-4 btn-sm md:btn-md rounded-xl"
						onClick={toggleTheme}
					>
						{globalState.theme === "light" ? (
							<LightModeIcon className="text-xl md:text-2xl text-base-content" />
						) : (
							<DarkModeIcon className="text-xl md:text-2xl text-base-content" />
						)}
					</div>

					{status === "authenticated" ? (
						<div className="dropdown dropdown-end text-base-content">
							<label
								tabIndex={0}
								className="btn btn-ghost rounded-btn px-2"
							>
								<PersonIcon />
								<article className="mx-2 hidden sm:block">
									{session.user.role
										?.split("-")
										.map(
											(w) =>
												w.charAt(0).toUpperCase() +
												w.slice(1),
										)
										.join(" ")}
								</article>
							</label>
							<ul
								tabIndex={0}
								className="menu dropdown-content z-1 p-4 shadow-lg rounded-box min-w-60 w-fit mt-4 bg-primary text-primary-content"
							>
								<article className="mx-2 mb-4">
									<span className="text-xs opacity-70">
										Signed In As
									</span>
									<br />
									<b className="text-lg">
										{session.user?.name}
									</b>
								</article>
								<li>
									<a
										className="bg-primary-focus flex gap-2"
										onClick={async () => {
											await signOut({ redirect: false })
											window.location.href = `${process.env.NEXT_PUBLIC_AUTH0_ISSUER}/v2/logout?client_id=${process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent("https://nice.fhir-web-apps.cloud.edu.au/")}`
										}}
									>
										<LogoutIcon /> Sign Out
									</a>
								</li>
							</ul>
						</div>
					) : (
						<Link href={"/api/auth/signin"}>
							<div className="btn btn-ghost btn-sm md:btn-md rounded-xl md:outline text-sm md:text-lg flex gap-1">
								<LoginIcon />
								<span className="xs:inline">Sign In</span>
							</div>
						</Link>
					)}
				</div>
			</div>
			<div className="divider divider-base-200 m-0 h-0"></div>
		</div>
	)
}

export default NavBar
