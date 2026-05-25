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
			{/* Added dropdown-bottom for mobile and restored sm:dropdown-right for larger screens */}
			<div className="dropdown dropdown-bottom sm:dropdown-right w-full">
				<div
					tabIndex={0}
					role="button"
					className="btn w-full justify-between font-normal bg-base-100 border-base-300 hover:border-base-300"
					style={{ backgroundImage: "none" }}
				>
					<span className="truncate">
						{selectedValues.length === 0
							? "Select options..."
							: `${selectedValues.length} selected`}
					</span>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={2}
						stroke="currentColor"
						className="inline-block w-4 h-4 stroke-current"
					>
						{/* Changed path to a downward chevron */}
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M19.5 8.25l-7.5 7.5-7.5-7.5"
						/>
					</svg>
				</div>

				<ul
					tabIndex={0}
					className="dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-full sm:ml-1 max-h-60 overflow-y-auto border border-base-300 flex-nowrap"
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
