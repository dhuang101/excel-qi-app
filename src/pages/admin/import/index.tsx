import { useEffect, useState } from "react"
import Papa from "papaparse"
import React from "react"

function ImportPage() {
	const [file, setFile] = useState<File | null>(null)
	const [users, setUsers] = useState<any>([])

	function handlePreview() {
		if (!file) {
			return
		}

		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: function (results) {
				// merge rows with the same record_id
				setUsers(
					Object.values(
						results.data.reduce(
							(mergedRows: any, currentRow: any) => {
								if (
									Object.keys(mergedRows).includes(
										currentRow.record_id
									)
								) {
									for (const key in currentRow) {
										if (currentRow[key] === "") {
											continue
										} else {
											mergedRows[currentRow.record_id][
												key
											] = currentRow[key]
										}
									}
								} else {
									mergedRows[currentRow.record_id] =
										currentRow
								}
								return mergedRows
							},
							{}
						) as Record<string, any>
					)
				)
			},
		})
	}

	function handleImport() {}

	useEffect(() => {
		console.log(users)
	}, [users])

	return (
		<div className="flex flex-col grow w-full items-center bg-base-100">
			<div className="flex flex-col items-center w-2/3 h-full">
				{users.length > 0 ? (
					<React.Fragment></React.Fragment>
				) : (
					<React.Fragment>
						<article className="text-2xl font-semibold my-4">
							Import Cohort
						</article>
						<div>
							<fieldset className="fieldset">
								<legend className="fieldset-legend">
									.csv file only
								</legend>
								<input
									type="file"
									accept=".csv"
									onChange={(e) =>
										setFile(
											e.target.files
												? e.target.files[0]
												: null
										)
									}
									className="file-input"
								/>
								<label className="label">Max size 1MB</label>
							</fieldset>
							<button
								className="btn mt-2"
								onClick={handlePreview}
							>
								Preview
							</button>
						</div>
					</React.Fragment>
				)}
			</div>
		</div>
	)
}

export default ImportPage
