import "dayjs/locale/en-gb"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import NavBar from "@/components/NavBar"
import StateLoader from "@/components/StateLoader"
import GlobalStore from "@/store/GlobalStore"
import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"
import { NextPage } from "next"
import { ReactElement, ReactNode } from "react"
import LoginTimeSaver from "@/components/LoginTimeSaver"

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout
}

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
	return (
		<SessionProvider session={session}>
			<LocalizationProvider
				dateAdapter={AdapterDayjs}
				adapterLocale="en-gb"
			>
				<GlobalStore>
					<StateLoader>
						{Component.getLayout ? (
							Component.getLayout(<Component {...pageProps} />)
						) : (
							<div className="flex flex-col h-fit min-h-screen min-w-screen">
								<NavBar />
								<Component {...pageProps} />
								<article className="font-light fixed bottom-0 right-0">
									v0.07
								</article>
							</div>
						)}
						<LoginTimeSaver />
					</StateLoader>
				</GlobalStore>
			</LocalizationProvider>
		</SessionProvider>
	)
}
