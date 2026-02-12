import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import bcrypt from "bcryptjs"
import type { JWT } from "next-auth/jwt"
import type { NextAuthOptions, Session, User } from "next-auth"
import { supabaseServer } from "@/lib/supabase-server"
import NextAuth from "next-auth"

export const authOptions: NextAuthOptions = {
    adapter: SupabaseAdapter({
        url: process.env.SUPABASE_URL!,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    }),

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const { data: user } = await supabaseServer
                    .from("users")
                    .select("*")
                    .eq("email", credentials.email)
                    .single()

                if (!user) return null

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!isValid) return null

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                }
            },
        }),
    ],

    session: { strategy: "jwt" },

    callbacks: {
        async jwt({
            token,
            user,
        }: {
            token: JWT
            user?: User
        }) {
            if (user) {
                token.id = user.id
            }
            return token
        },

        async session({
            session,
            token,
        }: {
            session: Session
            token: JWT
        }) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        },
    },


    pages: {
        signIn: "/login",
    },
}