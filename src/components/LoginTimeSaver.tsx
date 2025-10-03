import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/router"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)
// this component is required to send the login time to the server
// it is it's own component so that it can be wrapped in the SessionProvider
function LoginTimeSaver() {
	// nextjs router
	const router = useRouter()
	// auth session
	const { data: session, status } = useSession()

	useEffect(() => {
		if (session && status === "authenticated") {
			// we use dayjs here to ensure the date is in the correct timezone
			const currentDate = dayjs().tz("Australia/Sydney").format()
			axios
				.post("/api/database/postLoginDate", {
					email: session.user.email,
					loginDate: currentDate,
				})
				.catch((error) => {
					console.error("Error 500", error)
					router.push("/error")
				})
		}
	}, [status])

	return null
}

export default LoginTimeSaver
