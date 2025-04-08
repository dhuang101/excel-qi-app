// types/next-auth.d.ts
import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
	interface Session {
		user: {
			name?: string | null
			email?: string | null
			image?: string | null
			role?: "admin" | "read-only" // ✅ Add custom property here
		}
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		role?: string // ✅ Add to JWT too if using jwt callback
		email?: string // optional, if you're storing it for later use
	}
}
