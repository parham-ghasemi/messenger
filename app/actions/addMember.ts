"use server"

import prisma from '@/app/libs/prismadb'
import getCurrentUser from './getCurrentUser'

const addMember = async (channelId: string, userId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.phoneNumber) {
      return null;
    }

    const newMember = await prisma.channel.update({
      where: {
        id: channelId
      },
      data: {
        members: {
          connect: {
            id: userId
          }
        }
      }
    });

    return newMember

  } catch (error: any) {
    console.error('Error adding member: ', error)
    return null;
  }
};

export default addMember