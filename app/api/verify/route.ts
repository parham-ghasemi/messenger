import { getVerificationTokenByNumber } from "@/app/actions/getVerificationTokenByNumber";
import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb'

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber, userInput } = body

    const token = await getVerificationTokenByNumber(phoneNumber);
    

    if (!token) {
      return new NextResponse('Token not found', { status: 404 })
    }

    if (token.token !== userInput) {
      return new NextResponse('Invalid token', {status: 400})
    }

    const user = await prisma.user.update({
      where:{
        phoneNumber
      },
      data: {
        verified: true
      }
    })

    return new NextResponse('verified user', {status: 200})

  } catch (error: any) {
    console.log('VERIFY_ERROR: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}