"use server"

import prisma from '@/app/libs/prismadb'
import getCurrentUser from './getCurrentUser'

const removeMember = async (channelId: string, userId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.phoneNumber) {
      return null;
    }

    const removedMember = await prisma.channel.update({
      where: {
        id: channelId
      },
      data: {
        members: {
          disconnect: {
            id: userId
          }
        }
      }
    });

    return removedMember

  } catch (error: any) {
    console.error('Error adding member: ', error)
    return null;
  }
};

export default removeMember