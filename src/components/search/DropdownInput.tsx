import { diagnosis_resp_options } from "@/constants/search/selectOptions"
import { ChangeEventHandler } from "react"

interface Props {
	title: string
	handleSelectChange(
		area:
			| "diagnosis_resp"
			| "diagnosis_cardiac"
			| "outcm_hosp_discharge_loc"
	): ChangeEventHandler<HTMLSelectElement> | undefined
}

function DropdownInput(props: Props) {
	return (
		<label className="form-control w-full max-w-xs">
			<div className="label">
				<span className="label-text">{props.title}</span>
			</div>
			<select
				className="select select-bordered"
				onChange={props.handleSelectChange("diagnosis_resp")}
			>
				{diagnosis_resp_options.map((value) => (
					<option>{value}</option>
				))}
			</select>
		</label>
	)
}

export default DropdownInput
