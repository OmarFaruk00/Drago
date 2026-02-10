/**
 * Auth utilities - signToken, verifyToken for admin JWT + NextAuth config
 */

import jwt from "jsonwebtoken";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser, findOrCreateOAuthUser } from "@/lib/services/userService";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await loginUser(credentials.email, credentials.password);
        return user ? { id: user.id, email: user.email, name: user.name, image: user.avatar } : null;
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })]
      : []),
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
      ? [FacebookProvider({ clientId: process.env.FACEBOOK_CLIENT_ID, clientSecret: process.env.FACEBOOK_CLIENT_SECRET })]
      : []),
  ],
  callbacks: {
    async signIn({ user: authUser, account }) {
      if (account?.provider === "credentials") return true;
      const profile = {
        email: authUser.email,
        name: authUser.name,
        image: authUser.image,
        provider: account.provider,
        providerId: account.providerAccountId,
      };
      const user = await findOrCreateOAuthUser(profile);
      if (user) {
        authUser.id = user.id;
        return true;
      }
      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id;
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
};

const JWT_SECRET = process.env.JWT_SECRET || "drago-store-secret-key-change-in-production";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
