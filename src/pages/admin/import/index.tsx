import { useState } from "react"

function ImportPage() {
	const [file, setFile] = useState<File | null>(null)

	function handleUpload() {
		if (!file) {
			return
		}
	}

	return (
		<div className="flex flex-col grow w-full items-center bg-base-100">
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
									e.target.files ? e.target.files[0] : null
								)
							}
							className="file-input"
						/>
						<label className="label">Max size 1MB</label>
					</fieldset>
					<button className="btn mt-2" onClick={handleUpload}>
						Preview
					</button>
				</div>
			</div>
		</div>
	)
}

export default ImportPage
