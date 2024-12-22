import { getVerificationTokenByNumber } from "./getVerificationTokenByNumber";
import prisma from '@/app/libs/prismadb'

export const generateVerificationToken = async (phoneNumber: string) => {
  const token = Math.floor((Math.random() * 900000) + 100000).toString();

  const expires = new Date(new Date().getTime() + 15 * 60 * 1000);  

  const existingToken = await getVerificationTokenByNumber(phoneNumber);

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verficationToken = await prisma.verificationToken.create({
    data: {
      phoneNumber,
      token,
      expires,
    }
  });

  return verficationToken;
};