import prsima from '@/app/libs/prismadb'

export const getVerificationTokenByNumber = async (
  phoneNumber: string
) => {
  try {
    const verificationToken = await prsima.verificationToken.findFirst({
      where: { phoneNumber }
    });

    return verificationToken;
  } catch {
    return null;
  }
}