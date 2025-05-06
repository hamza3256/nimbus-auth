import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import GitHubProvider from "next-auth/providers/github";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";

const configuredProviders: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "credentials",
    credentials: {
      login: { label: "Email or Username", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      // TODO: Implement enterprise-grade rate limiting for failed login attempts here.
      // This might involve tracking attempts in a database or a service like Redis/KV.
      // Consider IP-based and/or user-identifier-based limiting.

      if (!credentials?.login || !credentials?.password) {
        throw new Error("Email/Username and password are required");
      }

      const user = await db.query.users.findFirst({
        where: or(
          eq(users.email, credentials.login),
          eq(users.username, credentials.login),
        ),
      });

      if (!user || !user.password) {
        throw new Error("Invalid credentials");
      }

      if (!user.emailVerified) {
        throw new Error("Please verify your email before signing in");
      }

      const isPasswordValid = await bcrypt.compare(
        credentials.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        username: user.username,
      };
    },
  }),
];

// Conditionally add GoogleProvider
if (
  process.env.GOOGLE_AUTH_ENABLED !== "false" && // Enabled if not explicitly 'false'
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET
) {
  configuredProviders.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

// Conditionally add FacebookProvider
if (
  process.env.FACEBOOK_AUTH_ENABLED !== "false" && // Enabled if not explicitly 'false'
  process.env.FACEBOOK_CLIENT_ID &&
  process.env.FACEBOOK_CLIENT_SECRET
) {
  configuredProviders.push(
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  );
}

// Conditionally add GitHubProvider
if (
  process.env.GITHUB_AUTH_ENABLED !== "false" &&
  process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_SECRET
) {
  configuredProviders.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true, // Recommended for trusted providers
    }),
  );
}

// TODO: Add AppleProvider
// Conditionally add AppleProvider
// Note: Apple's secret might be more complex (e.g., involving APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY)
// For simplicity, we'll check for APPLE_ID and APPLE_SECRET here.
// Adjust the condition based on your specific Apple secret setup.
if (
  process.env.APPLE_AUTH_ENABLED !== "false" && // Enabled if not explicitly 'false'
  process.env.APPLE_ID &&
  process.env.APPLE_SECRET
) {
  configuredProviders.push(
    AppleProvider({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET,
      // If you use the more complex JWT generation for Apple client secret,
      // you might need additional env vars and logic here or within the provider setup.
    }),
  );
}

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  providers: configuredProviders,
  callbacks: {
    async session({ token, session }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username; // Ensure username is passed to session
      }
      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await db.query.users.findFirst({
        where: user?.id ? eq(users.id, user.id) : eq(users.email, token.email!),
      });

      if (!dbUser) {
        if (user) {
          token.id = user?.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        username: dbUser.username,
      };
    },
  },
};
