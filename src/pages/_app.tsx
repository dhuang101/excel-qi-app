import "dayjs/locale/en-gb"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import NavBar from "@/components/NavBar"
import StateLoader from "@/components/StateLoader"
import GlobalStore from "@/contexts/GlobalStore"
import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { useRef } from "react"

export default function App({ Component, pageProps }: AppProps) {
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
			<GlobalStore>
				<StateLoader>
					<div className="flex flex-col h-fit min-h-screen min-w-screen">
						<NavBar />
						<Component {...pageProps} />
					</div>
				</StateLoader>
			</GlobalStore>
		</LocalizationProvider>
	)
}
