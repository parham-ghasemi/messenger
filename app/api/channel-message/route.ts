import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { message, image, channelId, replyToId } = body;

    if (!currentUser?.id || !currentUser?.phoneNumber) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image: image,
        Channel: {
          connect: {
            id: channelId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
        replyTo: replyToId ? { connect: { id: replyToId } } : undefined,
      },
      include: {
        seen: true,
        sender: true,
        replyTo: true,
      },
    });

    await pusherServer.trigger(channelId, 'channel:new', newMessage);

    return NextResponse.json(newMessage);
  } catch (error: any) {
    console.error(error, 'ERROR_CHANNEL_MESSAGES');
    return new NextResponse('InternalError', { status: 500 });
  }
}
