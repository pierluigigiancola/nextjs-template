import NextAuth from "next-auth";
import LinkedIn from "next-auth/providers/linkedin";

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  // @ts-expect-error
  providers: [LinkedIn],
});
