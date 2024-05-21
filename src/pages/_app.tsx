import "@/styles/globals.css"
import { Layout, Menu } from "antd"
import type { AppProps } from "next/app"

const { Header } = Layout

export default function App({ Component, pageProps }: AppProps) {
	return (
		<Layout className="min-h-screen min-w-screen">
			<Header>
				<article className="text-primary">NICE Data Project</article>
				<Menu
					theme="dark"
					mode="horizontal"
					defaultSelectedKeys={["2"]}
					items={[{ key: "1", label: "item1" }]}
				/>
			</Header>
			<Component {...pageProps} />
		</Layout>
	)
}
