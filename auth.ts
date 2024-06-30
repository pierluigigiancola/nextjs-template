import { db } from "@/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import LinkedIn from "next-auth/providers/linkedin";
import Twitter from "next-auth/providers/twitter";

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [Twitter, LinkedIn],
});
