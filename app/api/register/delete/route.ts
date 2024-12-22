import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
    try {
        // Check if request has a body
        if (!request.body) {
            return new NextResponse('No request body', { status: 400 });
        }

        let body;
        try {
            body = await request.json();
        } catch (e) {
            return new NextResponse('Invalid JSON', { status: 400 });
        }

        const { phoneNumber } = body;

        if (!phoneNumber) {
            return new NextResponse('Phone number required', { status: 400 });
        }

        // Delete the unverified user
        await prisma.user.deleteMany({
            where: {
                phoneNumber,
                verified: false
            }
        });

        return new NextResponse('User deleted', { status: 200 });
    } catch (error) {
        console.error('DELETE_USER_ERROR', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}