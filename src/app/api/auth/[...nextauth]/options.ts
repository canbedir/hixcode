import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaClient } from "@prisma/client";
import { Account, Profile, User } from "next-auth";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: User;
      account: Account | null;
      profile?: Profile | undefined;
    }) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: {
            githubId: account?.providerAccountId,
          },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              name: user.name || "",
              email: user.email || "",
              githubId: account?.providerAccountId || "",
              image: user.image || "",
              username: (profile as any)?.login || "",
            },
          });
        } else {
          await prisma.user.update({
            where: {
              githubId: account?.providerAccountId,
            },
            data: {
              name: user.name || "",
              email: user.email || "",
              image: user.image || "",
              username: (profile as any)?.login || "",
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Failed to save the user:", error);
        return false;
      }
    },

    async session({ session, token, user }) {
      if (token) {
        session.accessToken = token.accessToken as string;
        if (session.user) {
          (session.user as any).id = token.sub as string;
        }
      }
      return session;
    },

    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
};
