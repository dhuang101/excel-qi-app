import React, { useState } from "react"
import { useSession } from "next-auth/react"
import UserPermissions from "@/components/admin/UserPermissions"
import ImportCohort from "@/components/admin/ImportCohort"

type CurrentPage = "permissions" | "import"

function AdminPage() {
	const { data: session } = useSession()
	const [currentPage, setCurrentPage] = useState<CurrentPage>("permissions")

	return (
		<div className="flex flex-col grow w-full items-center bg-base-100">
			<div className="w-4/5 h-full">
				<article className="text-3xl font-semibold mt-4 mb-2">
					Admin Panel
				</article>

				<div role="tablist" className="tabs tabs-border tabs-lg mb-4">
					<a
						role="tab"
						className={`tab ${
							currentPage === "permissions" ? "tab-active" : ""
						}`}
						onClick={() => setCurrentPage("permissions")}
					>
						User Permissions
					</a>
					{session?.user.role === "admin" && (
						<a
							role="tab"
							className={`tab ${
								currentPage === "import" ? "tab-active" : ""
							}`}
							onClick={() => setCurrentPage("import")}
						>
							Import Cohort
						</a>
					)}
				</div>

				{currentPage === "permissions" ? (
					<UserPermissions />
				) : (
					<ImportCohort />
				)}
			</div>
		</div>
	)
}

export default AdminPage
