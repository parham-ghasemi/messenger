import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { message, image, conversationId } = body;

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
      },
      include: {
        seen: true,
        sender: true,
      },
    });

    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    await pusherServer.trigger(conversationId, 'messages:new', newMessage);

    const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

    for (const user of updatedConversation.users) {
      await pusherServer.trigger(user.phoneNumber!, 'conversation:update', {
        id: conversationId,
        messages: [lastMessage],
      });

      // Send notification using Pusher Beams
      if (user.id !== currentUser.id) {
        const beamsAuthUrl = `https://735344b7-970f-457e-a33c-95e1dbd93d7c.pushnotifications.pusher.com/publish_api/v1/instances/735344b7-970f-457e-a33c-95e1dbd93d7c/publishes`;
        const beamsAuthHeaders = {
          Authorization: `Bearer 1D4D9F9BB798F2B3CCC8EDD38CD87F042842809313B886F506A08C1BADDA94CF`,
          'Content-Type': 'application/json',
        };
        const beamsAuthBody = {
          interests: [user.phoneNumber!],
          web: {
            notification: {
              title: `New message from ${currentUser.name}`,
              body: message || 'You have a new message',
              deep_link: `https://messenger-delta-fawn.vercel.app/conversations/${conversationId}`,
            },
          },
        };

        try {
          console.log('Sending notification with body:', beamsAuthBody);
          const response = await axios.post(beamsAuthUrl, beamsAuthBody, { headers: beamsAuthHeaders });
          console.log('Notification sent:', response.data);
        } catch (error: any) {
          console.error('Error sending notification:', error.response?.data || error.message);
        }
      }
    }

    return NextResponse.json(newMessage);
  } catch (error: any) {
    console.error(error, 'ERROR_MESSAGES');
    return new NextResponse('InternalError', { status: 500 });
  }
}