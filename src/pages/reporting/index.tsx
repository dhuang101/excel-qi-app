import axios from "axios"
import reportReducer, { ACTION } from "@/reducers/reportReducer"
import { CircularProgress } from "@mui/material"
import { useEffect, useReducer, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import qs from "qs"
import { FormatSiteName } from "@/utilities/FormatSiteName"
import React from "react"
import SingleView from "@/components/reporting/SingleView"
import ComparisonView from "@/components/reporting/ComparisonView"

type displayViews = "Single" | "Comparison"

function ReportingPage() {
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
		if (status !== "authenticated") {
			return
		}

		let payload = {}
		axios
			.get("/api/database/getCounts", {
				params: {
					role: session?.user.role,
					sites: session?.user.sites,
				},
				paramsSerializer: (params) =>
					qs.stringify(params, { arrayFormat: "brackets" }),
			})
			.then((result) => {
				payload = { countData: result.data }
			})
			.then(() => {
				return Promise.resolve(
					axios.get("/api/database/getLosValues", {
						params: {
							role: session?.user.role,
							sites: session?.user.sites,
						},
						paramsSerializer: (params) =>
							qs.stringify(params, { arrayFormat: "brackets" }),
					})
				)
			})
			.then((result) => {
				payload = { ...payload, losData: result.data }
			})
			.then(() => {
				console.log(payload)
				dispatch({ type: ACTION.SET_SUMMARY, payload: payload })
			})
	}, [status])

	function switchView() {
		setCurrentView((current) => {
			return current === "Single" ? "Comparison" : "Single"
		})
	}

	return (
		<div className="flex flex-col grow w-full items-center">
			{state.countData[0]?.totalDocuments > 0 ? (
				<div className="flex flex-col w-2/3 h-full items-center">
					<div className="flex justify-between items-center w-full mt-4">
						<button
							className="btn btn-primary"
							onClick={switchView}
						>
							Change to{" "}
							{currentView === "Single" ? "Comparison" : "Single"}{" "}
							View
						</button>
					</div>
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
		</div>
	)
}

export default ReportingPage
