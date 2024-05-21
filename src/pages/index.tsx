import React from "react"
import { LaptopOutlined } from "@ant-design/icons"
import { Layout, Menu } from "antd"

const { Content, Sider } = Layout

function Home() {
	return (
		<Layout>
			<Sider width={200}>
				<Menu
					mode="inline"
					defaultSelectedKeys={["1"]}
					defaultOpenKeys={["sub1"]}
					className="h-full"
					items={[
						{
							key: "3",
							label: "option 1",
							icon: <LaptopOutlined />,
							children: [
								{
									key: "2",
									label: "suboption 1",
								},
							],
						},
					]}
				/>
			</Sider>
			<Layout className="p-24">
				<Content className="p-8 h-fit bg-slate-300">
					<div className="h-[2000px]"></div>
				</Content>
			</Layout>
		</Layout>
	)
}

export default Home
