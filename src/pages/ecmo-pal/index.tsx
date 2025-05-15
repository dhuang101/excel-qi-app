function EcmoPalSearch() {
	return (
		<div className="flex flex-col grow w-full items-center">
			<div className="w-2/3 h-full">
				<div className="flex-flex-col w-full">
					<article className="text-2xl font-semibold my-4">
						ECMO PAL Prediction
					</article>
					<article className="text-lg font-semibold mb-2">
						Patient Search
					</article>
					<div className="flex items-center mb-4">
						<input
							type="text"
							className="input mr-4"
							placeholder="Search by ID"
							onKeyDown={(event) => {}}
							onChange={(event) => {}}
						/>
						<button
							className="btn btn-primary"
							onClick={(event) => {}}
						>
							Search
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default EcmoPalSearch
