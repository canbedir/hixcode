import NextAuth, { NextAuthOptions } from "next-auth";
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
            email: user.email || undefined,
          },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              name: user.name || "",
              email: user.email || "",
              githubId: account?.providerAccountId || "",
              image: user.image || "",
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
          (session.user as any).id = token.sub as string; // GitHub kullanıcı kimliğini ekleyin
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
