import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
	const { pathname } = req.nextUrl

	// Public paths
	const publicPaths = ["/", "/forbidden"]
	if (publicPaths.includes(pathname)) {
		return NextResponse.next()
	}

	// Admin-only route
	if (pathname.startsWith("/admin")) {
		if (!token || token.role !== "admin") {
			return NextResponse.redirect(new URL("/forbidden", req.url))
		}
		return NextResponse.next()
	}

	// Require auth for all other routes
	if (!token) {
		return NextResponse.redirect(new URL("/api/auth/signin", req.url))
	}

	return NextResponse.next()
}

// Don't apply middleware to these internal paths
export const config = {
	matcher: ["/((?!_next|favicon.ico|api/auth).*)"],
}
