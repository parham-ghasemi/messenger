"use server"

import prisma from '@/app/libs/prismadb'

const validateResetPhoneNumber = async (phoneNumber:string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        phoneNumber: phoneNumber
      }
    })

    return user
  } catch(error: any) {
    console.error(error, ': ERROR_VALIDATE_RESET_PHONE_NUMBER')
    return null
  }
}

export default validateResetPhoneNumber