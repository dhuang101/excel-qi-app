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
					cardBody={
						"The Alfred Hospital's clinical ECMO guidelines with regards to the context of their experience and processes in place."
					}
					link={"https://ecmo.icu/#menuRoot"}
				/>
				<ResourceCard
					imageRes={[500, 152]}
					imageSrc={ASSETS.ccm}
					cardTitle={"Critical Care"}
					cardBody={
						"Canada's Largest extracorporeal life-support program's educational resources."
					}
					link={"https://criticalcaretoronto.com/ecmo-101/"}
				/>
			</div>
			<div className="flex gap-x-20">
				<ResourceCard
					imageRes={[1042, 313]}
					imageSrc={ASSETS.elso}
					cardTitle={"ELSO"}
					cardBody={
						"Discussion board, presentations, job listings, newsletters, guidelines and articles to help ELSO centers. Plus, resources to help patients and caregivers understand ECMO."
					}
					link={"https://www.elso.org/ecmo-resources.aspx"}
				/>
				<ResourceCard
					imageRes={[500, 152]}
					imageSrc={ASSETS.em}
					cardTitle={"ECMO Resource"}
					cardBody={
						"A space where ECMO Specialists, educators, directors and coordinators offer resources specifically designed for the Global ECMO Community."
					}
					link={"https://ecmoresource.com/"}
				/>
			</div>
			<div className="flex gap-x-20">
				<ResourceCard
					imageRes={[1042, 313]}
					imageSrc={ASSETS.jhm}
					cardTitle={"John Hopkins Medicine"}
					cardBody={
						"Information for ECMO patient's and their loved ones"
					}
					link={
						"https://www.hopkinsmedicine.org/heart-vascular-institute/cardiac-surgery/ecmo-patient-family-resources"
					}
				/>
				<ResourceCard
					imageRes={[500, 152]}
					imageSrc={ASSETS.litfl}
					cardTitle={"Life In The Fastlane"}
					cardBody={
						"Blog posts are created by ICU Senior Registrars, Fellows, and Consultants and are peer-reviewed by one or more ECMO specialists from the Alfred ICU."
					}
					link={"https://litfl.com/everything-ecmo/"}
				/>
			</div>
			<div className="flex gap-x-20">
				<ResourceCard
					imageRes={[1042, 313]}
					imageSrc={ASSETS.vecmos}
					cardTitle={"VECMOS"}
					cardBody={
						"Resources and education for ECMO clinicians as well as information on upcoming VECMOS events"
					}
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
