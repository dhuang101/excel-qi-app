import nodemailer from "nodemailer"
import { MongoClient } from "mongodb"
import NextAuth, { User } from "next-auth"
import { JWT } from "next-auth/jwt"
import OktaProvider from "next-auth/providers/okta"
import { createAccountProvisionedEmail } from "@/utilities/accountProvisionedTemplate"
// import Auth0Provider from "next-auth/providers/auth0"

const client = await MongoClient.connect(
	process.env.DB_CONNECTION_URI as string
)
const db = client.db("main")
const rolesCollection = db.collection("permissions")

export const authOptions = {
	// Configure one or more authentication providers
	providers: [
		// Auth0Provider({
		// 	clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID as string,
		// 	clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
		// 	issuer: process.env.NEXT_PUBLIC_AUTH0_ISSUER,
		// }),
		OktaProvider({
			clientId: process.env.NEXT_PUBLIC_OKTA_CLIENT_ID as string,
			clientSecret: process.env.OKTA_CLIENT_SECRET as string,
			issuer: process.env.NEXT_PUBLIC_OKTA_ISSUER,
			profile(profile) {
				return {
					id: profile.sub,
					name: profile.name,
					email: profile.email,
					preferred_username:
						profile.preferred_username ?? profile.email ?? null,
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }: { token: JWT; user?: User }) {
			// ensure we are fetching the email as user.email only exist on initial signin
			const email = user?.preferred_username ?? token?.email
			// attach permissions from database
			if (email) {
				const permissions = await rolesCollection.findOne({ email })
				if (permissions) {
					token.role = permissions.role
					token.sites = permissions.redcap_data_access_group
				} else {
					// provision the user a new public account
					await rolesCollection.insertOne({
						email,
						role: "public",
						redcap_data_access_group: [],
						name: user?.name || "",
					})

					try {
						const transporter = nodemailer.createTransport({
							service: "gmail",
							auth: {
								user: process.env.GMAIL_USER,
								pass: process.env.GMAIL_PASS,
							},
						})
						const mailOptions = {
							from: process.env.GMAIL_USER,
							to: process.env.GMAIL_USER,
							subject: "EXCEL QI Account Provision Notification",
							html: createAccountProvisionedEmail(
								user?.name || email
							),
						}
						await transporter.sendMail(mailOptions)
					} catch (error) {
						console.error("Error sending email:", error)
					}
				}
			}
			token.email = email
			return token
		},
		session({ session, token }: any) {
			session.user.role = token.role
			session.user.sites = token.sites
			return session
		},
	},
	pages: { signIn: "/auth/signin" },
}

export default NextAuth(authOptions)
