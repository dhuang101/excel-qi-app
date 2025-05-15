import EcmoPalTable from "@/components/ecmo-pal/EcmoPalTable"
import { useRouter } from "next/navigation"

function EcmoPalSearch() {
	const router = useRouter()

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
					<EcmoPalTable
						patientData={[
							{ record_id: "17fcd7ecc2ade010dc499366734d456e" },
						]}
						onClick={(event) => {
							router.push(
								"/ecmo-pal/17fcd7ecc2ade010dc499366734d456e"
							)
						}}
					/>
				</div>
			</div>
		</div>
	)
}

export default EcmoPalSearch
