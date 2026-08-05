import React from "react"

interface TableProps<T> {
	data: T[]
	headers: string[]
	renderRow: (row: T, index: number) => React.ReactNode
	emptyMessage?: string
}

function Table<T>({ data, headers, renderRow, emptyMessage }: TableProps<T>) {
	return (
		<React.Fragment>
			{data.length > 0 ? (
				<div className="overflow-x-auto w-full max-h-[70vh]">
					<table className="table table-lg w-full border-separate border-spacing-0">
						<thead>
							<tr>
								{headers.map((header, i) => (
									<th
										key={i}
										className={`bg-base-300 text-lg font-semibold sticky top-0 z-2 ${
											i === 0 ? "sticky left-0 z-10" : ""
										}`}
									>
										{header}
									</th>
								))}
							</tr>
						</thead>
						<tbody>{data.map(renderRow)}</tbody>
					</table>
				</div>
			) : (
				<div className="flex flex-col justify-center items-center h-[89%]">
					<article className="text-3xl font-semibold pt-4">
						{emptyMessage || "No data available"}
					</article>
				</div>
			)}
		</React.Fragment>
	)
}

export default Table
