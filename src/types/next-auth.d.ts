import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
    }
}

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            email?: string | null
            name?: string | null
        }
    }

    interface User {
        id: string
    }
}
