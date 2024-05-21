import React from "react"
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs"
import Document, {
	Head,
	Html,
	Main,
	NextScript,
	DocumentContext,
} from "next/document"

export default function AppDocument() {
	return (
		<Html lang="en">
			<Head />
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}

// function is adjusted for Antd Component Package
// https://ant.design/docs/react/use-with-next
AppDocument.getInitialProps = async (ctx: DocumentContext) => {
	const cache = createCache()
	const originalRenderPage = ctx.renderPage
	ctx.renderPage = () =>
		originalRenderPage({
			enhanceApp: (App) => (props) =>
				(
					<StyleProvider cache={cache}>
						<App {...props} />
					</StyleProvider>
				),
		})

	const initialProps = await Document.getInitialProps(ctx)
	const style = extractStyle(cache, true)
	return {
		...initialProps,
		styles: (
			<>
				{initialProps.styles}
				<style dangerouslySetInnerHTML={{ __html: style }} />
			</>
		),
	}
}
