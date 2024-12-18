
import bcrypt from 'bcrypt'
import { AuthOptions } from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from '@next-auth/prisma-adapter'

import prisma from "@/app/libs/prismadb";

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
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

        if(!user.verified){
          throw new Error('Account not verified')
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
      if (user) {
        token.id = user.id;
        token.phoneNumber = user.phoneNumber; 
      }
      return token;
    },
    async session({ session, token }) {
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