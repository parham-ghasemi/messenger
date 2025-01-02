import prisma from '@/app/libs/prismadb';
// import getCurrentUser from './getCurrentUser';

const getMessageById = async (messageId: string) => {
  try {
    // const currentUser = await getCurrentUser();


    // if (!currentUser?.phoneNumber) {
    //   return null;
    // }

    const message = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });

    return message;
  } catch (error: any) {
    console.error('getMessageById: ', error);
    return null;
  }
};

export default getMessageById;