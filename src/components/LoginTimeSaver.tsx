import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect } from "react"

// this component is required to send the login time to the server
// it is it's own component so that it can be wrapped in the SessionProvider
function LoginTimeSaver() {
	// auth session
	const { data: session, status } = useSession()

	useEffect(() => {
		if (session && status === "authenticated") {
			const currentTime = new Date()
			axios.post("/api/database/postLoginDate", {
				email: session.user.email,
				loginTime: currentTime,
			})
		}
	}, [status])

	return null
}

export default LoginTimeSaver
