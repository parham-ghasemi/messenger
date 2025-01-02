import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import PushNotifications from '@pusher/push-notifications-server';
import axios from "axios";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { message, image, conversationId, replyToId } = body;

    if (!currentUser?.id || !currentUser?.phoneNumber) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image: image,
        conversation: {
          connect: {
            id: conversationId,
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

    await pusherServer.trigger(conversationId, 'messages:new', newMessage);

    // console.log("NEW_MESSAGE: "+newMessage.replyTo)

    return NextResponse.json(newMessage);
  } catch (error: any) {
    console.error(error, 'ERROR_MESSAGES');
    return new NextResponse('InternalError', { status: 500 });
  }
}