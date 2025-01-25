"use server"

import prisma from '@/app/libs/prismadb'
import bcrypt from "bcrypt";

const updatePassword = async (password: string, phoneNumber: string) => {
  try {

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.update({
      where: {
        phoneNumber: phoneNumber
      },
      data: {
        hashedPassword
      }
    })

    return user;
  } catch (e: any) {
    console.log(e, 'ERROR_UPDATE_PASSWORD')
   }
}

export default updatePassword