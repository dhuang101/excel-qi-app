import { useEffect, useState } from "react"
import Papa from "papaparse"
import React from "react"
import ImportPreviewTable from "@/components/admin/ImportPreviewTable"
import { TranslateExcel } from "@/utilities/TranslateExcel"

function ImportPage() {
	const [file, setFile] = useState<File | null>(null)
	const [rows, setRows] = useState<any>([])

	function handlePreview() {
		if (!file) {
			return
		}

		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: function (results) {
				// merge rows with the same record_id
				setRows(
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
											// translate fields from EXCEL dictionary where applicable
											TranslateExcel(currentRow, key)
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
		console.log(rows)
	}, [rows])

	return (
		<div className="flex flex-col grow w-full items-center bg-base-100">
			{rows.length > 0 ? (
				<div className="flex flex-col items-center w-4/5 h-full">
					<article className="text-2xl font-semibold my-4">
						Import Preview
					</article>
					<ImportPreviewTable records={rows} />
				</div>
			) : (
				<div className="flex flex-col items-center w-2/3 h-full">
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
						<button className="btn mt-2" onClick={handlePreview}>
							Preview
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default ImportPage
