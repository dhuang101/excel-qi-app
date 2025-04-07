import { MongoClient } from "mongodb"
import NextAuth from "next-auth"
import Auth0Provider from "next-auth/providers/auth0"

const client = await MongoClient.connect(
	process.env.DB_CONNECTION_URI as string
)
const db = client.db("main")
const rolesCollection = db.collection("permissions")

export const authOptions = {
	// Configure one or more authentication providers
	providers: [
		Auth0Provider({
			clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID as string,
			clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
			issuer: process.env.NEXT_PUBLIC_AUTH0_ISSUER,
		}),
	],
	callbacks: {
		async jwt({ token, user }: any) {
			if (user?.email) {
				const userRole = await rolesCollection.findOne({
					email: user.email,
				})
				token.role = userRole?.role || "guest"
			}
			return token
		},
		async session({ session, token }: any) {
			session.user.role = token.role
			return session
		},
	},
}

export default NextAuth(authOptions)
