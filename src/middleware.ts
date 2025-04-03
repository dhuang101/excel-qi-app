import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
	function middleware(req) {
		return NextResponse.next()
	},
	{
		pages: {
			signIn: "api/auth/signin", // Redirect unauthenticated users to this page
		},
	}
)

// Protect all pages EXCEPT the root ("/")
export const config = {
	matcher: ["/((?!$).*)"], // This ensures "/" is excluded from authentication
}
