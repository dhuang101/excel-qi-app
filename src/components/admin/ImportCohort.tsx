import React, { useState } from "react"
import { useRouter } from "next/router"
import Papa from "papaparse"
import axios from "axios"
import ImportPreviewTable from "@/components/admin/ImportPreviewTable"
import { TranslateExcel } from "@/utilities/TranslateExcel"
import { excelImportRow } from "@/types/excelImportTypes"

export default function ImportCohort() {
	// nextjs router
	const router = useRouter()
	const [file, setFile] = useState<File | null>(null)
	const [rows, setRows] = useState<excelImportRow[]>([])

	function handlePreview() {
		if (!file) return

		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: function (results) {
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
										if (currentRow[key] === "") continue
										else {
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

	function handleGoBack() {
		setRows([])
		setFile(null)
	}

	function handleImport() {
		axios
			.post("/api/database/import/postCsv", {
				records: rows,
			})
			.then((response) => {
				alert(response.data.message)
				handleGoBack()
			})
			.catch((error) => {
				console.error("Error fetching permissions:", error)
				router.push("/error")
			})
	}

	return rows.length > 0 ? (
		<div className="flex flex-col items-center w-full h-full">
			<article className="text-2xl font-semibold my-4">
				Import Preview
			</article>
			<div className="w-4/5 flex justify-between">
				<button className="btn btn-primary mb-4" onClick={handleGoBack}>
					Go Back
				</button>
				<button className="btn btn-primary mb-4" onClick={handleImport}>
					Import
				</button>
			</div>
			<ImportPreviewTable records={rows} />
		</div>
	) : (
		<div className="flex w-full justify-center">
			<div>
				<fieldset className="fieldset">
					<legend className="fieldset-legend">.csv file only</legend>
					<input
						type="file"
						accept=".csv"
						onChange={(e) =>
							setFile(e.target.files ? e.target.files[0] : null)
						}
						className="file-input file-input-primary"
					/>
					<label className="label">Max size 1MB</label>
				</fieldset>
				<button
					className="btn btn-primary mt-2"
					onClick={handlePreview}
				>
					Preview
				</button>
			</div>
		</div>
	)
}
