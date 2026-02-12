
import NextAuth from "next-auth"
import { authOptions } from "@/src/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }


// import NextAuth from "next-auth"
// import { authOptions } from "@/src/auth"

// const handler = NextAuth(authOptions)

// export { handler as GET, handler as POST }



// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { SupabaseAdapter } from "@auth/supabase-adapter";
// import bcrypt from "bcryptjs";
// import { supabase } from "@/lib/supabase";

// export const handler = NextAuth({
//     adapter: SupabaseAdapter({
//         url: process.env.SUPABASE_URL!,
//         secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
//     }),

//     providers: [
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID!,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//         }),
//         CredentialsProvider({
//             name: "Credentials",
//             credentials: {
//                 email: { label: "Email", type: "email" },
//                 password: { label: "Password", type: "password" },
//             },
//             async authorize(credentials) {
//                 if (!credentials?.email || !credentials?.password) {
//                     return null;
//                 }

//                 // const res = await fetch(
//                 //     `${process.env.NEXTAUTH_URL}/api/auth/login`,
//                 //     {
//                 //         method: "POST",
//                 //         headers: { "Content-Type": "application/json" },
//                 //         body: JSON.stringify({
//                 //             email: credentials.email,
//                 //             password: credentials.password,
//                 //         }),
//                 //     }
//                 // );

//                 const { data: user, error } = await supabase
//                     .from("users")
//                     .select("*")
//                     .eq("email", credentials.email)
//                     .single();

//                 if (error || !user) return null;

//                 const isValid = await bcrypt.compare(credentials.password, user.password);

//                 if (!isValid) return null;

//                 // if (!res.ok) return null;

//                 // const user = await res.json();

//                 return {
//                     id: user.id,
//                     email: user.email,
//                     name: user.name,
//                 };
//             },
//         }),
//     ],

//     session: {
//         strategy: "jwt",
//     },

//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) {
//                 token.id = user.id;
//             }
//             return token;
//         },
//         async session({ session, token }) {
//             if (session.user) {
//                 session.user.id = token.id as string;
//             }
//             return session;
//         },
//     },

//     pages: {
//         signIn: "/login",
//     },
// });

// export { handler as GET, handler as POST };
