import type { NextAuthOptions, Profile } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/lib/transactional-emails";

const googleEnabled =
  !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

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

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email.toLowerCase()))
          .limit(1);

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name || user.email,
          role: user.role,
          plan: user.plan,
        };
      },
    }),
    ...(googleEnabled
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // For Google OAuth: auto-create user in DB on first sign-in
      if (account?.provider === "google" && user.email) {
        const email = user.email.toLowerCase();
        const [existing] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!existing) {
          const googleProfile = profile as Profile & { picture?: string };
          await db.insert(users).values({
            email,
            name: user.name || googleProfile?.name || email,
            passwordHash: null, // OAuth users have no password
            role: "user",
            plan: "free",
          });

          // Fire-and-forget welcome email
          sendWelcomeEmail(email, user.name || email).catch((err) =>
            console.error("[auth] Welcome email failed:", err)
          );
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Credentials sign-in: user already has id/role/plan from authorize()
      const userWithRole = user as { role?: string; plan?: string } | undefined;
      if (user && userWithRole?.role) {
        token.id = user.id;
        token.role = userWithRole.role;
        token.plan = userWithRole.plan ?? "free";
      }

      // OAuth sign-in: fetch from DB (user object is from provider, not our DB)
      if (account?.provider === "google" && user?.email) {
        const [dbUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email.toLowerCase()))
          .limit(1);
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.plan = dbUser.plan;
        }
      }

      // Refresh role and plan from DB periodically (every 5 minutes)
      const now = Math.floor(Date.now() / 1000);
      const lastRefresh = (token.refreshedAt as number) || 0;
      if (now - lastRefresh > 300 && token.id) {
        try {
          const [freshUser] = await db
            .select({ role: users.role, plan: users.plan })
            .from(users)
            .where(eq(users.id, token.id as string))
            .limit(1);
          if (freshUser) {
            token.role = freshUser.role;
            token.plan = freshUser.plan;
          }
          token.refreshedAt = now;
        } catch {
          // If DB fails, keep existing token values
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.plan = token.plan as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const isGoogleEnabled = googleEnabled;
