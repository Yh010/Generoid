import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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
      const existingUser = await prisma.generoidUsers.findUnique({
        where: { email: profile?.email }
      })
      if (!existingUser) {
        await prisma.generoidUsers.create({
          data: {
            email: profile?.email,
            name: profile?.name,
          }
        })
      }
      return true
    }
  },
  secret: process.env.NEXTAUTH_SECRET
})

export const GET = handler
export const POST =handler