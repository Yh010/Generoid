import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { CheckExistingUser, CreateNewUser } from "../../lib/prismaFunctions";

//TODO: when deploying, change the call back urls and authorized urls to the deployed domain
export const handler = NextAuth({
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
      })
  ],
  callbacks: {
    async signIn({ profile }) {
      const existingUser = await CheckExistingUser(profile)
      if (!existingUser) {
        await CreateNewUser(profile)
      }
      return true
    }
  },
  secret: process.env.NEXTAUTH_SECRET
})

export const GET = handler
export const POST =handler