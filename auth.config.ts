
import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

export default {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID || "",
            clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
            const isOnCreate = nextUrl.pathname.startsWith('/wrap/create')

            if (isOnDashboard || isOnCreate) {
                if (isLoggedIn) return true
                return false // Redirect to login page
            }
            return true
        },
    }
} satisfies NextAuthConfig
