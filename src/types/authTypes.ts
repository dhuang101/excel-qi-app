// types/next-auth.d.ts
import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
	interface Session {
		user: {
			name?: string | null
			email?: string | null
			picture?: string | null
			role?: "admin" | "global-viewer" | "site-viewer"
			sites?: string[]
		}
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		role?: string
		email?: string
		sites: string[]
	}
}
