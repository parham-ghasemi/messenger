import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      name,
      description,
      members
    } = body;

    if (!currentUser?.id || !currentUser?.phoneNumber) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!name || !members || members.length < 1) {
      return new NextResponse('Invalid data', { status: 400 });
    }

    const generateRandomColor = () => {
      const randomColor = Math.floor(Math.random() * 16777215).toString(16);
      return `#${randomColor}`
    }

    const color = generateRandomColor();

    const newChannel = await prisma.channel.create({
      data: {
        name,
        description,
        owner: {
          connect: {
            id: currentUser.id
          }
        },
        color,
        members: {
          connect: [
            ...members.map((member: { value: string }) => ({
              id: member.value
            })),
            {
              id: currentUser.id
            }
          ]
        }
      },
      include: {
        members: true,
        owner: true
      }
    });

    // Notify all members about the new channel
    newChannel.members.forEach((user) => {
      if (user.phoneNumber) {
        pusherServer.trigger(user.phoneNumber, 'channel:new', newChannel);
      }
    });

    return NextResponse.json(newChannel);

  } catch (error: any) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}