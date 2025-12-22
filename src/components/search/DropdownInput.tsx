import {
	ECMO_INDICIATION_OPTIONS,
	ECMO_MODE_OPTIONS,
} from "@/constants/search/selectOptions"
import { ChangeEventHandler } from "react"

interface Props {
	title: string
	queryAttribute: "ecmo_mode" | "ecmo_indication"
	handleSelectChange(
		area: "ecmo_mode" | "ecmo_indication"
	): ChangeEventHandler<HTMLSelectElement> | undefined
}

const optionsMap = {
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
					<option key={value} className="text-base-content">
						{value}
					</option>
				))}
			</select>
		</label>
	)
}

export default DropdownInput
