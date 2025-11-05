import axios from "axios"
import reportReducer, { ACTION } from "@/reducers/reportReducer"
import { CircularProgress } from "@mui/material"
import { useEffect, useReducer, useState } from "react"
import { useSession } from "next-auth/react"
import React from "react"
import SingleView from "@/components/reporting/SingleView"
import ComparisonView from "@/components/reporting/ComparisonView"
import { useRouter } from "next/router"

type displayViews = "Single" | "Comparison"

function ReportingPage() {
	// nextjs router
	const router = useRouter()
	// auth session
	const { data: session, status } = useSession()
	// state
	const [state, dispatch] = useReducer(reportReducer, {
		countData: [],
		losData: [],
	})
	const [currentView, setCurrentView] = useState<displayViews>("Single")

	// sequentially fetch the data
	// TODO: fetch them in parallel?
	useEffect(() => {
		let payload = {}
		axios
			.post("/api/database/getCounts", {
				role: session?.user.role || "public",
				sites: session?.user.sites || [],
			})
			.then((result) => {
				payload = { countData: result.data }
			})
			.then(() => {
				return Promise.resolve(
					axios.post("/api/database/getLosValues", {
						role: session?.user.role || "public",
						sites: session?.user.sites || [],
					})
				)
			})
			.then((result) => {
				payload = { ...payload, losData: result.data }
			})
			.then(() => {
				dispatch({ type: ACTION.SET_SUMMARY, payload: payload })
			})
			.catch((error) => {
				console.error("Error fetching data:", error)
				router.push("/error")
			})
	}, [status, router, session?.user.role, session?.user.sites])

	function switchView() {
		setCurrentView((current) => {
			return current === "Single" ? "Comparison" : "Single"
		})
	}

	return (
		<div className="flex flex-col grow w-full items-center justify-center">
			{state.countData[0]?.totalDocuments > 0 ? (
				<div className="flex flex-col w-2/3 h-full items-center">
					{session?.user &&
						session.user.role !== "public" &&
						!(
							session.user.role === "site-viewer" &&
							session.user.sites.length === 0
						) && (
							<div className="flex justify-between items-center w-full mt-4">
								<button
									className="btn btn-primary"
									onClick={switchView}
								>
									Change to{" "}
									{currentView === "Single"
										? "Comparison"
										: "Single"}{" "}
									View
								</button>
							</div>
						)}
					{currentView === "Single" ? (
						<SingleView state={state} />
					) : (
						<ComparisonView state={state} />
					)}
				</div>
			) : (
				<div className="flex flex-col justify-center items-center h-[83vh]">
					<CircularProgress size={80} />
					<article className="text-lg font-semibold pt-4">
						Creating Summary...
					</article>
				</div>
			)}
			<div className="flex justify-center items-center h-24">
				<article>
					Please send any queries or suggestions to
					carol.hodgson@monash.edu
				</article>
			</div>
		</div>
	)
}

export default ReportingPage
