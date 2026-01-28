// types/next-auth.d.ts
import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
	interface Session {
		user: {
			name?: string | null
			email?: string | null
			picture?: string | null
			role?: "admin" | "global-viewer" | "site-viewer" | "public"
			sites: string[]
		}
	}
	interface User {
		preferred_username?: string | null
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		role?: "admin" | "global-viewer" | "site-viewer" | "public"
		email?: string
		sites: string[]
	}
}
