import { DIAGNOSIS_RESP_OPTIONS } from "@/constants/search/selectOptions"
import { DIAGNOSIS_CARDIAC_OPTIONS } from "@/constants/search/selectOptions"
import { OUTCM_HOSP_DISCHARGE_LOC_OPTIONS } from "@/constants/search/selectOptions"
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
		diagnosis_resp: DIAGNOSIS_RESP_OPTIONS,
		diagnosis_cardiac: DIAGNOSIS_CARDIAC_OPTIONS,
		outcm_hosp_discharge_loc: OUTCM_HOSP_DISCHARGE_LOC_OPTIONS,
	}

	return (
		<label className="form-control w-1/4">
			<div className="pb-2">
				<span className="label-text">{title}</span>
			</div>
			<select
				className="select w-full"
				onChange={handleSelectChange(queryAttribute)}
			>
				{optionsMap[queryAttribute].map((value) => (
					<option key={value}>{value}</option>
				))}
			</select>
		</label>
	)
}

export default DropdownInput
