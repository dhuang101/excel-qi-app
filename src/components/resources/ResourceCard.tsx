import Image from "next/image"
import Link from "next/link"

interface Props {
	imageRes: [number, number]
	imageSrc: string
	cardTitle: string
	cardBody: string
	link: string
}

function ResourceCard({
	imageRes,
	imageSrc,
	cardTitle,
	cardBody,
	link,
}: Props) {
	return (
		<div className="card bg-base-100 w-96 shadow-md h-fit">
			<div className="flex justify-center bg-slate-300 min-h-36">
				<Image
					width={imageRes[0]}
					height={imageRes[1]}
					src={imageSrc}
					className="max-w-80 w-full h-auto object-contain"
					alt={cardTitle}
				/>
			</div>
			<div className="card-body bg-base-300">
				<article className="card-title">{cardTitle}</article>
				<article>{cardBody}</article>
				<div className="card-actions justify-end">
					<Link
						className="btn btn-primary"
						rel="noopener noreferrer"
						target="_blank"
						href={link}
					>
						Link
					</Link>
				</div>
			</div>
		</div>
	)
}

export default ResourceCard
