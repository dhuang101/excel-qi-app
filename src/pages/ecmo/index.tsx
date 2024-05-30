import axios from "axios"
import React from "react"
import { useState } from "react"

function EcmoPage() {
	const testVars = {
		model_name: "Full",
		variables: {
			Year: 1,
			AgeYears: 18,
			BMI: 28,
			"Coronary Artery Disease": 0,
			"Chronic Heart Failure": 0,
			"Chronic Lung Disease": 0,
			"Pre ECMo C/T Surg": 0,
			"PE ECLS Ltx": 0,
			"Pulmonary Embolism": 0,
			AKI: 0,
			SBP: 77,
			"Pre-ECMO Cardiac Arrest": 0,
			ECPR: 0,
			IntubationToTimeOnHours: 0,
			RateBreathsSec: 12,
			FiO2: 100,
			"Renal Replacement Therapy": 0,
			"Vasopressors/Inotropes": 0,
			Bicarbonate: 0,
			Lactate: 7.2,
			pH: 7.27,
			PO2: 150,
			PCO2: 47,
			HCO3: 19,
		},
	}

	const [prediction, setPrediction] = useState({})

	function handleClick() {
		axios.post("http://localhost:5000/evaluate", testVars).then((res) => {
			console.log(res.data)
			setPrediction(res.data)
		})
	}

	return (
		<div className="flex flex-col h-full w-full justify-center items-center">
			<article>Bruno Wilfred</article>
			{Object.keys(prediction).length > 0 ? (
				<React.Fragment>
					<article>
						Survival to Discharge:{" "}
						{(prediction.out_value * 100).toFixed(1)}%
					</article>
					<article>
						Base Value: {(prediction.base_value * 100).toFixed(1)}%
					</article>
				</React.Fragment>
			) : (
				<React.Fragment>
					{Object.entries(testVars.variables).map((obj) => {
						return (
							<div className="flex" key={obj[0]}>
								<article>
									{obj[0]}: {obj[1]}
								</article>
							</div>
						)
					})}
					<button className="btn" onClick={handleClick}>
						Run Prediction
					</button>
				</React.Fragment>
			)}
		</div>
	)
}

export default EcmoPage
