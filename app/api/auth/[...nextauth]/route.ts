import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
     providers: [
    CredentialsProvider({
        name: 'Credentials',
        credentials: {
          username: { label: 'email', type: 'text', placeholder: 'Email' },
          password: { label: 'password', type: 'password', placeholder: 'password' },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async authorize(credentials: any) {
            
            return {
                id: "user1"
            };
        },
      })
  ],
  secret: process.env.NEXTAUTH_SECRET
})

export const GET = handler
export const POST =handler