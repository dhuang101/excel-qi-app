function ResourcesPage() {
	return (
		<div className="flex flex-col items-center">
			<article className="my-4 text-3xl font-semibold">
				ECMO Resources
			</article>
			<div className="flex gap-x-20">
				<div className="card bg-base-100 w-96 shadow-sm">
					<div>
						<img
							src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
							alt="Shoes"
						/>
					</div>
					<div className="card-body bg-base-300">
						<h2 className="card-title">Card Title</h2>
						<p>
							A card component has a figure, a body part, and
							inside body there are title and actions parts
						</p>
						<div className="card-actions justify-end">
							<button className="btn btn-primary">Buy Now</button>
						</div>
					</div>
				</div>
				<div className="card bg-base-100 w-96 shadow-sm">
					<figure>
						<img
							src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
							alt="Shoes"
						/>
					</figure>
					<div className="card-body bg-base-300">
						<h2 className="card-title">Card Title</h2>
						<p>
							A card component has a figure, a body part, and
							inside body there are title and actions parts
						</p>
						<div className="card-actions justify-end">
							<button className="btn btn-primary">Buy Now</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ResourcesPage
