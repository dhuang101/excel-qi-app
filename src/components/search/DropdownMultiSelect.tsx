import React from "react"
import { UserEnteredQuery } from "@/types/searchTypes"
import {
	DIAGNOSIS_CARDIAC_OPTIONS,
	DIAGNOSIS_RESP_OPTIONS,
	OUTCM_HOSP_DISCHARGE_LOC_OPTIONS,
} from "@/constants/search/selectOptions"

interface DropdownMultiSelectProps {
	title: string
	selectedValues: string[]
	queryKey:
		| "diagnosis_resp"
		| "diagnosis_cardiac"
		| "outcm_hosp_discharge_loc"
	onSelect: (option: string, key: keyof UserEnteredQuery) => void
	onSelectAll: (key: keyof UserEnteredQuery, options: string[]) => void
	onClearAll: (key: keyof UserEnteredQuery) => void
}

const optionsMap = {
	diagnosis_resp: DIAGNOSIS_RESP_OPTIONS,
	diagnosis_cardiac: DIAGNOSIS_CARDIAC_OPTIONS,
	outcm_hosp_discharge_loc: OUTCM_HOSP_DISCHARGE_LOC_OPTIONS,
}

function DropdownMultiSelect({
	title,
	selectedValues,
	queryKey,
	onSelect,
	onSelectAll,
	onClearAll,
}: DropdownMultiSelectProps) {
	return (
		<div className="form-control w-full">
			<div className="pb-2">
				<span className="label-text font-medium">{title}</span>
			</div>
			<div className="dropdown w-full">
				<div
					tabIndex={0}
					role="button"
					className="select select-bordered w-full flex items-center justify-between overflow-hidden"
				>
					<span className="truncate">
						{selectedValues.length === 0
							? "Select options..."
							: `${selectedValues.length} selected`}
					</span>
				</div>
				<ul
					tabIndex={0}
					className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full mt-1 max-h-60 overflow-y-auto border border-base-300 flex-nowrap"
				>
					<div className="flex justify-between px-2 py-1 mb-2 border-b border-base-200">
						<button
							type="button"
							className="text-xs font-bold text-primary hover:underline"
							onClick={() =>
								onSelectAll(queryKey, optionsMap[queryKey])
							}
						>
							Select All
						</button>
						<button
							type="button"
							className="text-xs font-bold text-error hover:underline"
							onClick={() => onClearAll(queryKey)}
						>
							Clear All
						</button>
					</div>
					{optionsMap[queryKey].map((option) => (
						<li key={option}>
							<label className="label cursor-pointer justify-start gap-3 py-2">
								<input
									type="checkbox"
									className="checkbox checkbox-primary checkbox-sm"
									checked={selectedValues.includes(option)}
									onChange={() => onSelect(option, queryKey)}
								/>
								<article className="text-left text-base-content">
									{option}
								</article>
							</label>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default DropdownMultiSelect
