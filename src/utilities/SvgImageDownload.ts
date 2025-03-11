// downloads the svg as an image
export default function SvgImageDownload(
	svgRef: React.MutableRefObject<SVGSVGElement | null>,
	name: string
) {
	const svg = svgRef.current
	if (!svg) {
		return
	}

	const serializer = new XMLSerializer()
	const svgClone = svg.cloneNode(true) as SVGSVGElement

	const styleSheets = Array.from(document.styleSheets).flatMap((sheet) => {
		try {
			return Array.from(sheet.cssRules).map((rule) => rule.cssText)
		} catch {
			return []
		}
	})

	const styleElement = document.createElement("style")
	styleElement.textContent = styleSheets.join("\n")
	svgClone.insertBefore(styleElement, svgClone.firstChild)

	const svgString = serializer.serializeToString(svgClone)

	const canvas = document.createElement("canvas")
	canvas.width = svgClone.width.baseVal.value
	canvas.height = svgClone.height.baseVal.value

	const ctx = canvas.getContext("2d")
	if (!ctx) return

	const img = new Image()
	img.onload = () => {
		ctx.drawImage(img, 0, 0)
		const link = document.createElement("a")
		link.href = canvas.toDataURL("image/jpeg", 1.0)
		link.download = name
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}
	img.src = `data:image/svg+xml;base64,${btoa(svgString)}`
}
