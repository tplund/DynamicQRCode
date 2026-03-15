import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const VALID_EMAIL = process.env.AUTH_EMAIL!;
const VALID_PASSWORD = process.env.AUTH_PASSWORD!;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Adgangskode", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        if (
          credentials.email === VALID_EMAIL &&
          credentials.password === VALID_PASSWORD
        ) {
          return { id: "1", name: "Thomas Lund", email: VALID_EMAIL };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
