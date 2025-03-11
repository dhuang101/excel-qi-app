import { testEcmo } from "@/test-data/ecmo"
import axios from "axios"
import React, { useEffect, useState } from "react"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import { CircularProgress } from "@mui/material"

function EcmoPalPage() {
	const testVars = testEcmo

	const [modelDetails, setModelDetails]: any = useState({})
	const [prediction, setPrediction] = useState({
		out_value: null,
		base_value: null,
		altering_features: [],
	})
	const [loading, setLoading] = useState(false)

	function handleClick() {
		setLoading(true)
		axios
			.post("/api/ecmo-pal/evaluate", { variables: testEcmo })
			.then((result: any) => {
				setPrediction(result.data)
			})
			.then(() => {
				setLoading(false)
			})
	}

	function handleBack() {
		setPrediction({
			out_value: null,
			base_value: null,
			altering_features: [],
		})
	}

	useEffect(() => {
		axios.get("/api/ecmo-pal/models").then((res) => {
			setModelDetails(
				res.data.filter((obj: { name: string }) => {
					return obj.name === "Full"
				})[0]
			)
		})
	}, [])

	return (
		<div className="flex flex-col grow w-full items-center">
			<div className="flex flex-col h-full w-full mt-8 items-center">
				<article className="text-3xl font-semibold mb-4">
					Phil Phillip
				</article>
				{loading ? (
					<div className="flex flex-col justify-center items-center h-[83vh]">
						<CircularProgress size={80} />
						<article className="text-lg font-semibold pt-4">
							Running Prediction...
						</article>
					</div>
				) : prediction.base_value !== null &&
				  prediction.out_value !== null ? (
					<React.Fragment>
						<article className="text-3xl mb-4">
							Survival to Discharge:{" "}
							{(prediction.out_value * 100).toFixed(1)}%
						</article>
						<article className="text-xl mb-2">
							Output Explanation
						</article>
						<article className="text-lg mb-2">
							Starting Value:{" "}
							{(prediction.base_value * 100).toFixed(1)}%
						</article>
						<div className="flex w-3/12 py-1 justify-between">
							<article className="text-lg">Variable</article>
							<article className="text-lg">Contribution</article>
						</div>
						{prediction.altering_features.map(
							(obj: { label: string; value: number }) => {
								return (
									<div
										key={obj.label}
										className="flex w-3/12 border-b border-primary py-1 px-4 justify-between"
									>
										<article className="text-lg">
											{obj.label}:{" "}
										</article>
										<article>
											{(obj.value * 100).toFixed(1)}%
										</article>
									</div>
								)
							}
						)}
						<button
							className="btn btn-primary mt-4"
							onClick={handleBack}
						>
							Go Back
						</button>
					</React.Fragment>
				) : Object.keys(modelDetails).length > 0 ? (
					<React.Fragment>
						<article className="text-lg font-semibold">
							Model: {modelDetails.name}
						</article>
						{modelDetails.categories.map(
							(obj: {
								name: string
								features: {
									name: string
									label: string
									description: string
								}[]
							}) => {
								return (
									<React.Fragment key={obj.name}>
										<article
											className="text-lg mt-4"
											key={obj.name}
										>
											{obj.name}
										</article>
										{obj.features.map(
											(innerObj: {
												name: string
												label: string
												description: string
											}) => {
												if (innerObj.name === "Year") {
													return
												}
												return (
													<div
														key={innerObj.name}
														className="flex w-5/12 border-b border-primary py-1 px-4 justify-between"
													>
														<div
															className="flex tooltip tooltip-left"
															data-tip={
																innerObj.description
															}
														>
															<div className="mr-2">
																<InfoOutlinedIcon />
															</div>
															<article>
																{innerObj.label}
															</article>
														</div>
														<article>
															{testVars.variables[
																innerObj.name
															] === 0
																? "False"
																: testVars
																		.variables[
																		innerObj
																			.name
																  ]}
														</article>
													</div>
												)
											}
										)}
									</React.Fragment>
								)
							}
						)}
						<button
							className="btn btn-primary mt-4"
							onClick={handleClick}
						>
							Run Prediction
						</button>
					</React.Fragment>
				) : (
					<div className="flex justify-center items-center h-[83vh]">
						<CircularProgress size={80} />
						<article className="text-lg font-semibold pt-4">
							Fetching Models...
						</article>
					</div>
				)}
			</div>
		</div>
	)
}

export default EcmoPalPage
