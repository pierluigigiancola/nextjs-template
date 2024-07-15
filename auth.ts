import { db } from "@/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import LinkedIn from "next-auth/providers/linkedin";
import Twitter from "next-auth/providers/twitter";
import { accounts } from "./db/schema";

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [Twitter, LinkedIn],
  callbacks: {
    async session({ session, user }) {
      const [account] = await db.query.accounts.findMany({
        where: (fields, operators) =>
          operators.eq(fields.userId, session?.user?.id),
      });
      if (!account) {
        console.error("No Twitter account found for user", user.id);
        throw new Error("No Twitter account found");
      }
      if (!account.expires_at) {
        console.error("No expiration date found for Twitter account", account);
        throw new Error("No expiration date found");
      }
      if (account.expires_at * 1000 < Date.now()) {
        if (!process.env.AUTH_TWITTER_ID || !process.env.AUTH_TWITTER_SECRET) {
          console.error("Misconfigured Twitter environment variables");
          throw new Error("Missing Twitter environment variables");
        }
        if (!account.refresh_token) {
          console.error("No refresh token found for Twitter account", account);
          throw new Error("No refresh token found");
        }
        // If the access token has expired, try to refresh it
        try {
          // https://accounts.google.com/.well-known/openid-configuration
          // We need the `token_endpoint`.
          const response = await fetch(
            "https://api.twitter.com/2/oauth2/token",
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(
                  `${process.env.AUTH_TWITTER_ID}:${process.env.AUTH_TWITTER_SECRET}`
                ).toString("base64")}`,
              },
              body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: account.refresh_token,
              }),
              method: "POST",
            }
          );

          const responseTokens = await response.json();

          if (!response.ok) throw responseTokens;

          await db
            .update(accounts)
            .set({
              access_token: responseTokens.access_token,
              expires_at: Math.floor(
                Date.now() / 1000 + responseTokens.expires_in
              ),
              refresh_token: responseTokens.refresh_token,
            })
            .where(eq(accounts.userId, user.id));
        } catch (error) {
          console.error("Error refreshing access token", error);
          // The error property can be used client-side to handle the refresh token error
          session.error = "RefreshAccessTokenError";
        }
      }
      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    error?: "RefreshAccessTokenError";
  }
}
