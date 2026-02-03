import {
	ECMO_INDICIATION_OPTIONS,
	ECMO_MODE_OPTIONS,
} from "@/constants/search/selectOptions"

interface Props {
	title: string
	queryAttribute: "ecmo_mode" | "ecmo_indication"
	selectedValue?: string
	handleSelectChange(
		area: "ecmo_mode" | "ecmo_indication",
		value: string,
	): void
}

const optionsMap = {
	ecmo_mode: ECMO_MODE_OPTIONS,
	ecmo_indication: ECMO_INDICIATION_OPTIONS,
}

function DropdownInput({
	title,
	queryAttribute,
	selectedValue,
	handleSelectChange,
}: Props) {
	const displayValue = selectedValue || `Any`

	return (
		<div className="form-control w-full">
			<div className="pb-2">
				<span className="label-text">{title}</span>
			</div>

			<div className="dropdown dropdown-right w-full">
				<div
					tabIndex={0}
					role="button"
					className="btn w-full justify-between font-normal bg-base-100 border-base-300 hover:border-base-300"
				>
					{displayValue}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						className="inline-block w-4 h-4 stroke-current"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M9 5l7 7-7 7"
						></path>
					</svg>
				</div>

				<ul
					tabIndex={0}
					className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 ml-2 border border-base-200"
				>
					{optionsMap[queryAttribute].map((value) => (
						<li key={value}>
							<a
								onClick={() =>
									handleSelectChange(queryAttribute, value)
								}
							>
								{value}
							</a>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default DropdownInput
