import {
	DIAGNOSIS_RESP_OPTIONS,
	DIAGNOSIS_CARDIAC_OPTIONS,
	OUTCM_HOSP_DISCHARGE_LOC_OPTIONS,
	ECMO_INDICIATION_OPTIONS,
	ECMO_MODE_OPTIONS,
} from "@/constants/search/selectOptions"
import { ChangeEventHandler } from "react"

interface Props {
	title: string
	queryAttribute:
		| "diagnosis_resp"
		| "diagnosis_cardiac"
		| "outcm_hosp_discharge_loc"
		| "ecmo_mode"
		| "ecmo_indication"
	handleSelectChange(
		area:
			| "diagnosis_resp"
			| "diagnosis_cardiac"
			| "outcm_hosp_discharge_loc"
			| "ecmo_mode"
			| "ecmo_indication"
	): ChangeEventHandler<HTMLSelectElement> | undefined
}

const optionsMap = {
	diagnosis_resp: DIAGNOSIS_RESP_OPTIONS,
	diagnosis_cardiac: DIAGNOSIS_CARDIAC_OPTIONS,
	outcm_hosp_discharge_loc: OUTCM_HOSP_DISCHARGE_LOC_OPTIONS,
	ecmo_mode: ECMO_MODE_OPTIONS,
	ecmo_indication: ECMO_INDICIATION_OPTIONS,
}

function DropdownInput({ title, queryAttribute, handleSelectChange }: Props) {
	return (
		<label className="form-control w-full">
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
