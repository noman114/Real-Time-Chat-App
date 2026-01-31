import { NextAuthOptions, User } from "next-auth";
import dbConnect from "./db";
import mongoose from "mongoose";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import UserModel from "@/models/user.model";

const clientPromise = dbConnect().then(() => mongoose.connection.getClient());

const getGoogleCredentials = () => {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if (!clientId || clientId.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_ID')
    }

    if (!clientSecret || clientSecret.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_SECRET')
    }

    return { clientId, clientSecret }
}

const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: '/login',
    },
    providers: [
        GoogleProvider({
            clientId: getGoogleCredentials().clientId,
            clientSecret: getGoogleCredentials().clientSecret,
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            const dbUserResult = await UserModel.findOne({ id: token.id })

            if (!dbUserResult) {
                if (user) {
                    token.id = user!.id
                }

                return token
            }

            const dbUser = dbUserResult as User

            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image,
            }
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
            }

            return session
        },
        redirect() {
            return '/dashboard'
        },
    },
}

export default authOptions;