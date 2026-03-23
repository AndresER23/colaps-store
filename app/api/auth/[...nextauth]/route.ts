import NextAuth from "next-auth";
import NextAuthHandler from "next-auth/next";
import { authOptions } from "@/lib/auth";

const handler = NextAuthHandler(authOptions);
export { handler as GET, handler as POST };
