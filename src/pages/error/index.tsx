function ErrorPage() {
	return (
		<div className="flex flex-col grow w-full items-center justify-center">
			<div className="flex flex-col h-full w-2/3 items-center justify-center bg-base-100">
				<article className="text-4xl font-semibold mb-4">
					An Error Has Occurred
				</article>
				<article className="text-xl">
					Please Contact An Administrator
				</article>
			</div>
		</div>
	)
}

export default ErrorPage
