function ForbiddenPage() {
	return (
		<div className="flex flex-col justify-center items-center h-[83vh]">
			<article className="font-semibold text-2xl">
				403 Access Denied
			</article>
			<div className="divider"></div>
			<article>Sign in to access this page</article>
			<article>
				Please contact the site administrator if this is an error
			</article>
		</div>
	)
}

export default ForbiddenPage
