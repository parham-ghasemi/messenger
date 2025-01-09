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

    // Update channel name format
    const channelName = `channel_${channelId}`;
    
    try {
      await pusherServer.trigger(channelName, 'messages:new', newMessage);
    } catch (pusherError) {
      console.error('Pusher Error:', pusherError);
      // Continue execution - don't fail the whole request if push notification fails
    }

    return NextResponse.json(newMessage);
  } catch (error: any) {
    console.error('ERROR_MESSAGES', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
