import ResourceCard from "@/components/resources/ResourceCard"

import ASSETS from "@/assets/assets"

// This gets called on every request
// export async function getServerSideProps() {
// 	return { props: {} }
// }

function ResourcesPage() {
	return (
		<div className="flex flex-col items-center gap-y-8">
			<article className="text-3xl font-semibold mt-4">
				ECMO Resources
			</article>
			<div className="flex gap-x-20">
				<ResourceCard
					imageRes={[1042, 313]}
					imageSrc={ASSETS.alfred}
					cardTitle={"Alfred ECMO"}
					cardBody={"PLACEHOLDER"}
					link={"https://ecmo.icu/#menuRoot"}
				/>
				<ResourceCard
					imageRes={[500, 152]}
					imageSrc={ASSETS.ccm}
					cardTitle={"Critical Care"}
					cardBody={"PLACEHOLDER"}
					link={"https://criticalcaretoronto.com/ecmo-101/"}
				/>
			</div>
			<div className="flex gap-x-20">
				<ResourceCard
					imageRes={[1042, 313]}
					imageSrc={ASSETS.elso}
					cardTitle={"ELSO"}
					cardBody={"PLACEHOLDER"}
					link={"https://www.elso.org/ecmo-resources.aspx"}
				/>
				<ResourceCard
					imageRes={[500, 152]}
					imageSrc={ASSETS.em}
					cardTitle={"ECMO Resource"}
					cardBody={"PLACEHOLDER"}
					link={"https://ecmoresource.com/"}
				/>
			</div>
			<div className="flex gap-x-20">
				<ResourceCard
					imageRes={[1042, 313]}
					imageSrc={ASSETS.jhm}
					cardTitle={"John Hopkins Medicine"}
					cardBody={"PLACEHOLDER"}
					link={
						"https://www.hopkinsmedicine.org/heart-vascular-institute/cardiac-surgery/ecmo-patient-family-resources"
					}
				/>
				<ResourceCard
					imageRes={[500, 152]}
					imageSrc={ASSETS.litfl}
					cardTitle={"Life In The Fastlane"}
					cardBody={"PLACEHOLDER"}
					link={"https://litfl.com/everything-ecmo/"}
				/>
			</div>
			<div className="flex gap-x-20">
				<ResourceCard
					imageRes={[1042, 313]}
					imageSrc={ASSETS.vecmos}
					cardTitle={"VECMOS"}
					cardBody={"PLACEHOLDER"}
					link={
						"https://www.vecmos.org.au/health-professionals/resources/"
					}
				/>
			</div>
			{/* footer */}
			<div className="h-16" />
		</div>
	)
}

export default ResourcesPage
