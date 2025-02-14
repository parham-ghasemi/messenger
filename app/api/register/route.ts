
import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import validatePhoneNumber from "@/app/actions/validatePhoneNumber";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      phoneNumber,
      name,
      password
    } = body;

    if (!phoneNumber || !name || !password) {
      return new NextResponse('Missing info', { status: 400 })
    }

    const isPhoneNumberValid = validatePhoneNumber(phoneNumber)

    if (!isPhoneNumberValid) {
      return new NextResponse('Invalid phone number', { status: 400 })
    }


    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        phoneNumber,
        name,
        hashedPassword,
        verified: true
      }
    });

    return NextResponse.json(user)
  } catch (error: any) {
    console.log(error, 'REGISTRATION_ERROR');
    return new NextResponse('Internal Error', { status: 500 })
  }
}