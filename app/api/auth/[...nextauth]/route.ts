import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
//TODO: when deploying, change the call back urls and authorized urls to the deployed domain
const handler = NextAuth({
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
      })
    ],
  secret: process.env.NEXTAUTH_SECRET
})

export const GET = handler
export const POST =handler