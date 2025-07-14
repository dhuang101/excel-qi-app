function ImportPage() {
	return (
		<div className="flex flex-col grow w-full items-center bg-base-100">
			<div className="flex flex-col items-center w-2/3 h-full">
				<article className="text-2xl font-semibold my-4">
					Import Cohort
				</article>
				<fieldset className="fieldset">
					<legend className="fieldset-legend">.csv file only</legend>
					<input type="file" className="file-input" />
					<label className="label">Max size 2MB</label>
				</fieldset>
			</div>
		</div>
	)
}

export default ImportPage
