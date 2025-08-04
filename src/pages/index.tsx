import Link from "next/link"

export async function getServerSideProps() {
	return { props: {} }
}

function Home() {
	return (
		<div className="flex flex-col grow w-full items-center justify-center">
			<div className="flex flex-col h-full w-2/3 items-center justify-center bg-base-100">
				<article className="text-5xl font-semibold mb-8">
					EXCEL QI Project
				</article>
				<article className="w-3/4">
					The EXCEL QI Project is an innovative in development project
					to provide an intelligent platform for users of the EXCEL
					Registry by allowing them to efficiently explore and
					visualize data. The project aims to enhance the
					accessibility and usability of the data, making it easier
					for researchers and healthcare professionals to derive
					insights and make informed decisions.
					<br />
					<br />
					The platform will also leverage AI-driven analysis to
					interpret patient conditions and support recovery strategies
					bringing advanced intelligence to the forefront of patient
					care.
				</article>
				<div className="flex mt-12 w-2/3 justify-between">
					<Link href={"/search"}>
						<button className="btn btn-lg w-30 h-20 btn-primary">
							Registry Search
						</button>
					</Link>
					<Link href={"/reporting"}>
						<button className="btn btn-lg w-30 h-20 btn-primary">
							Reporting
						</button>
					</Link>
					<Link href={"/ecmo-pal"}>
						<button className="btn btn-lg w-30 h-20 btn-primary">
							ECMO Prediction
						</button>
					</Link>
					<Link href={"/resources"}>
						<button className="btn btn-lg w-30 h-20 btn-primary">
							ECMO Resources
						</button>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default Home
