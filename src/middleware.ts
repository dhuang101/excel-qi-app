import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
	const { pathname } = req.nextUrl

	// Public paths
	const publicPaths = [
		"/",
		"/error",
		"/forbidden",
		"/auth/signin",
		"/resources",
		"/reporting",
		"/api/database/getCounts",
		"/api/database/getLosValues",
	]
	if (publicPaths.includes(pathname)) {
		return NextResponse.next()
	}

	// Access to /admin
	if (pathname.startsWith("/admin")) {
		if (
			!token ||
			!["admin", "global-viewer"].includes(token.role as string)
		) {
			return NextResponse.redirect(new URL("/forbidden", req.url))
		}
		return NextResponse.next()
	}

	// Access to /api/database/permissions — admin only
	if (
		pathname.startsWith("/api/database/permissions/updatePerms") ||
		pathname.startsWith("/api/database/file-repo/uploadFile") ||
		pathname.startsWith("/api/database/file-repo/deleteFile") ||
		pathname.startsWith("/api/database/file-repo/updateFile")
	) {
		if (!token || token.role !== "admin") {
			return NextResponse.redirect(new URL("/forbidden", req.url))
		}
		return NextResponse.next()
	}

	// Block paths if not signed in
	// Signed in but no permissions
	// Site-viewer with no sites assigned
	if (
		!token ||
		token.role === "public" ||
		(token.role === "site-viewer" && token.sites.length === 0)
	) {
		return NextResponse.redirect(new URL("/forbidden", req.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ["/((?!_next|favicon.ico|api/auth).*)"], // Apply middleware to all routes except Next.js internals & auth
}
