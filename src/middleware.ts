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

	// Admin-only routes
	if (pathname.startsWith("/admin")) {
		if (!token || token.role !== "admin") {
			return NextResponse.redirect(new URL("/forbidden", req.url))
		}
		return NextResponse.next()
	}

	// All other paths require authentication
	if (!token) {
		return NextResponse.redirect(new URL("/forbidden", req.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ["/((?!_next|favicon.ico|api/auth).*)"], // Apply middleware to all routes except Next.js internals & auth
}
