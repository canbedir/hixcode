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
    async signIn({ user, account, profile }: { user: User; account: Account | null; profile?: Profile | undefined }) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email || undefined },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              name: user.name || '',
              email: user.email || '',
              image: user.image || '',
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Kullanıcı kaydedilemedi:", error);
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
