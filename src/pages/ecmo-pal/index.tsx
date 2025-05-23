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
							{ record_id: "873e179e37ab5690c171b6bc3e7f3909" },
							{ record_id: "f7cd69ea21421b23285648601466109c" },
							{ record_id: "af293cdca3f130669d739097c27fadda" },
							{ record_id: "11497fd6167f0dee4fe83b7c97864aa5" },
							{ record_id: "be2a1df1977780b273f7be44983500e8" },
							{ record_id: "5c284000117913aa02233c2364d0f7af" },
							{ record_id: "7655cff9c2e38283b0b38ed7487eb9d0" },
							{ record_id: "273ce9b21d325450e9083e83a0aa544b" },
							{ record_id: "d31c073bcf7ca5d23a61018fb9ffe854" },
						]}
						onClick={(event) => {
							router.push(
								`/ecmo-pal/${event.currentTarget.dataset.recordId}`
							)
						}}
					/>
				</div>
			</div>
		</div>
	)
}

export default EcmoPalSearch
