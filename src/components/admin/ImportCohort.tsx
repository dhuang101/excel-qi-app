import React, { useState } from "react"
import { useRouter } from "next/router"
import Papa from "papaparse"
import axios from "axios"
import ImportPreviewTable from "@/components/admin/ImportPreviewTable"
import { TranslateExcel } from "@/utilities/TranslateExcel"
import { excelImportRow } from "@/types/excelImportTypes"

export default function ImportCohort() {
	const router = useRouter()
	const [file, setFile] = useState<File | null>(null)
	const [rows, setRows] = useState<excelImportRow[]>([])
	// Changed error to a string so we can display specific messages if needed
	const [error, setError] = useState<string | null>(null)

	function handlePreview() {
		if (!file) return
		setError(null)

		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: function (results) {
				try {
					const mergedData = Object.values(
						results.data.reduce(
							(mergedRows: any, currentRow: any) => {
								if (
									Object.keys(mergedRows).includes(
										currentRow.record_id,
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
							{},
						) as Record<string, any>,
					) as excelImportRow[]

					setRows(mergedData)
				} catch (err: any) {
					setError(
						err.message ||
							"An unexpected error occurred during parsing.",
					)
					console.error(err)
				}
			},
			error: function (err) {
				setError(
					"Error reading the file. Please ensure it is a valid CSV.",
				)
				console.error(err)
			},
		})
	}

	function handleGoBack() {
		setRows([])
		setFile(null)
		setError(null)
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
				console.error("Error 500", error)
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
			<div className="flex flex-col">
				<fieldset className="fieldset">
					<legend className="fieldset-legend">.csv file only</legend>
					<input
						type="file"
						accept=".csv"
						onChange={(e) => {
							const selectedFile = e.target.files
								? e.target.files[0]
								: null
							const MAX_FILE_SIZE = 1 * 1024 * 1024

							if (
								selectedFile &&
								selectedFile.size > MAX_FILE_SIZE
							) {
								setError("File is too large. Max size is 1MB.")
								setFile(null)
								e.target.value = ""
								return
							}

							setFile(selectedFile)
							setError(null)
						}}
						className={`file-input file-input-primary ${error ? "file-input-error" : ""}`}
					/>
					<label className="label">Max size 1MB</label>
				</fieldset>

				<button
					className="btn btn-primary max-w-20 mt-2"
					onClick={handlePreview}
				>
					Preview
				</button>

				{error && (
					<div className="alert alert-error shadow-lg max-w-80 mt-4">
						<span className="text-white text-sm font-medium">
							{error}
						</span>
					</div>
				)}
			</div>
		</div>
	)
}
