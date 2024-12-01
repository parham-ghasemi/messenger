
import bcrypt from 'bcrypt'
import { AuthOptions } from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from '@next-auth/prisma-adapter'

import prisma from "@/app/libs/prismadb";

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        phoneNumber: { label: 'phoneNumber', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.phoneNumber || !credentials?.password) {
          throw new Error('Invalid Credentials');
        }
        const user = await prisma.user.findUnique({
          where: {
            phoneNumber: credentials.phoneNumber
          }
        });
        if (!user || !user?.hashedPassword) {
          throw new Error('Invalid Credentials');
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid Credentials');
        }

        return user;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add `phoneNumber` to the JWT when the user signs in
      if (user) {
        token.id = user.id;
        token.phoneNumber = user.phoneNumber; // This assumes `user.phoneNumber` exists in your user model
      }
      return token;
    },
    async session({ session, token }) {
      // Add `phoneNumber` to the session object
      if (session.user) {
        session.user.id = token.id as string;
        session.user.phoneNumber = token.phoneNumber as string;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions