import { ChangeEvent, KeyboardEvent, useState } from "react"
import SearchTable from "../../components/search/SearchTable"
import axios from "axios"

function SearchPage() {
	return (
		<div className="w-7/12 h-full">
			<article className="my-4 text-3xl font-semibold">
				Cohort Construction
			</article>
			<div className="flex flex-col w-full">
				<article className="my-4 text-xl">
					Find patients with...
				</article>
				<label className="form-control w-full max-w-xs">
					<div className="label">
						<span className="label-text">
							Respiratory Diagnosis
						</span>
					</div>
					<select className="select select-bordered">
						<option disabled selected>
							(Optional)
						</option>
						<option>ARDS (risk factor)</option>
						<option>Post lung transplant</option>
						<option>Direct lung trauma</option>
						<option>Pulmonary Vasculitis/Haemorrhage</option>
						<option>Focal lung disease (Not ARDS)</option>
						<option>Drug/Toxin pulmonary disease</option>
						<option>Asthma</option>
						<option>Chronic end stage lung disease</option>
					</select>
				</label>
				<label className="form-control w-full max-w-xs">
					<div className="label">
						<span className="label-text">Cardiac Diagnosis</span>
					</div>
					<select className="select select-bordered">
						<option disabled selected>
							(Optional)
						</option>
						<option>Acute myocaridal infarction (AMI)</option>
						<option>Myocarditis</option>
						<option>Toxic</option>
						<option>Septic shock with myocardial depression</option>
						<option>Pulmonary embolism</option>
						<option>Advanced pulmonary hypertension</option>
						<option>Congential heart disease</option>
						<option>Primary arrhythmia ("Channelopathy")</option>
						<option>Chronic graft (heart) dysfunction</option>
						<option>Chronic cardiomyopathy no covered above</option>
						<option>
							Acute decompensated heart not covered above
						</option>
						<option>Peri-operative support</option>
					</select>
				</label>
				<label className="form-control w-full max-w-xs">
					<div className="label">
						<span className="label-text">
							Hospital Discharge Location
						</span>
					</div>
					<select className="select select-bordered">
						<option disabled selected>
							(Optional)
						</option>
						<option>Home</option>
						<option>Transferred to another hospital</option>
						<option>Transfer to LTAC or rehab</option>
						<option>Transfer to hospice</option>
						<option>Dead</option>
						<option>Other</option>
					</select>
				</label>
			</div>
		</div>
	)
}

export default SearchPage
