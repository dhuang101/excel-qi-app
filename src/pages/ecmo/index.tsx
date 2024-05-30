import axios from "axios"
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

	const [clicked, setClicked] = useState(true)

	function handleClick() {
		axios.post("http://localhost:5000/evaluate", testVars).then((res) => {
			console.log(res)
		})
	}

	return (
		<div className="flex flex-col h-full w-full justify-center items-center">
			<button className="btn" onClick={handleClick}>
				click
			</button>
			<article hidden={clicked} className="text-9xl">
				65%
			</article>
		</div>
	)
}

export default EcmoPage
