import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Password",
      credentials: {
        password: { label: "Adgangskode", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          process.env.AUTH_PASSWORD_HASH!
        );

        if (isValid) {
          return { id: "1", name: "Admin" };
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
