/**
 * NextAuth API - Google, Facebook, and Email/Password login
 * Add to .env.local:
 *   NEXTAUTH_URL=http://localhost:3000 (or your Vercel URL)
 *   NEXTAUTH_SECRET=your-random-secret
 *   GOOGLE_CLIENT_ID=...
 *   GOOGLE_CLIENT_SECRET=...
 *   FACEBOOK_CLIENT_ID=...
 *   FACEBOOK_CLIENT_SECRET=...
 */

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
