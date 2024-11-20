import { diagnosis_resp_options } from "@/constants/search/selectOptions"
import { diagnosis_cardiac_options } from "@/constants/search/selectOptions"
import { outcm_hosp_discharge_loc_options } from "@/constants/search/selectOptions"
import { ChangeEventHandler } from "react"

interface Props {
	title: string
	queryAttribute:
		| "diagnosis_resp"
		| "diagnosis_cardiac"
		| "outcm_hosp_discharge_loc"
	handleSelectChange(
		area:
			| "diagnosis_resp"
			| "diagnosis_cardiac"
			| "outcm_hosp_discharge_loc"
	): ChangeEventHandler<HTMLSelectElement> | undefined
}

function DropdownInput({ title, queryAttribute, handleSelectChange }: Props) {
	const optionsMap = {
		diagnosis_resp: diagnosis_resp_options,
		diagnosis_cardiac: diagnosis_cardiac_options,
		outcm_hosp_discharge_loc: outcm_hosp_discharge_loc_options,
	}

	return (
		<label className="form-control w-full max-w-xs">
			<div className="label">
				<span className="label-text">{title}</span>
			</div>
			<select
				className="select select-bordered"
				onChange={handleSelectChange(queryAttribute)}
			>
				{optionsMap[queryAttribute].map((value) => (
					<option>{value}</option>
				))}
			</select>
		</label>
	)
}

export default DropdownInput
