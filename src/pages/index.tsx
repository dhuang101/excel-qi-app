import Link from "next/link"

export async function getServerSideProps() {
	return { props: {} }
}

function Home() {
	return (
		<div className="flex flex-col grow w-full items-center md:justify-center p-6 md:p-0">
			<div className="flex flex-col h-full w-full md:w-2/3 items-center justify-center bg-base-100">
				<article className="text-3xl md:text-5xl font-semibold mb-6 md:mb-8 text-center">
					EXCEL QI Project
				</article>

				<article className="w-full md:w-3/4 text-center md:text-left leading-relaxed">
					The EXCEL QI Project is an innovative, in-development
					platform that enables users of the EXCEL Registry to
					efficiently explore and visualise data. The project aims to
					enhance accessibility and usability of data, supporting
					researchers and healthcare professionals to derive insights
					and make informed decisions.
				</article>

				<div className="flex flex-col md:flex-row mt-8 md:mt-12 w-full md:w-2/3 gap-4 md:justify-between items-center">
					<Link href={"/search"} className="w-full md:w-auto">
						<button className="btn btn-lg w-full md:w-30 md:h-20 btn-primary">
							Registry Search
						</button>
					</Link>
					<Link href={"/reporting"} className="w-full md:w-auto">
						<button className="btn btn-lg w-full md:w-30 md:h-20 btn-primary">
							Reporting
						</button>
					</Link>
					<Link href={"/ecmo-pal"} className="w-full md:w-auto">
						<button className="btn btn-lg w-full md:w-30 md:h-20 btn-primary">
							ECMO Prediction
						</button>
					</Link>
					<Link href={"/resources"} className="w-full md:w-auto">
						<button className="btn btn-lg w-full md:w-30 md:h-20 btn-primary">
							ECMO Resources
						</button>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default Home
