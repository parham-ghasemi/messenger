import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server"
import prisma from "@/app/libs/prismadb"
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request:Request) {
    try{
        const currnetUser = await getCurrentUser();
        const body = await request.json();
        const {message, image, conversationId} = body;

        if(!currnetUser?.id || !currnetUser?.phoneNumber){
            return new NextResponse('Unauthorized', {status: 401});
        }

        const newMessage = await prisma.message.create({
            data:{
                body: message,
                image: image,
                conversation: {
                    connect: {
                        id: conversationId
                    }
                },
                sender:{
                    connect: {
                        id: currnetUser.id
                    }
                },
                seen: {
                    connect: {
                        id: currnetUser.id
                    }
                }
            },
            include: {
                seen: true,
                sender: true
            }
        });

        const updatedConversation = await prisma.conversation.update({
            where: {
                id: conversationId
            },
            data: {
                lastMessageAt: new Date(),
                messages: {
                    connect: {
                        id: newMessage.id
                    }
                }
            },
            include:{
                users: true,
                messages: {
                    include: {
                        seen: true
                    }
                }
            }
        });

        await pusherServer.trigger(conversationId, 'messages:new', newMessage);

        const lastMessage = updatedConversation.messages[updatedConversation.messages.length -1]

        updatedConversation.users.map((user) => {
          pusherServer.trigger(user.phoneNumber!, 'conversation:update', {
            id: conversationId,
            messages: [lastMessage]
          })
        })

    // Send notification using Pusher Beams
    const beamsAuthUrl = `https://735344b7-970f-457e-a33c-95e1dbd93d7c.pushnotifications.pusher.com/publish_api/v1/instances/735344b7-970f-457e-a33c-95e1dbd93d7c/publishes`;
    const beamsAuthHeaders = {
      Authorization: `Bearer 1D4D9F9BB798F2B3CCC8EDD38CD87F042842809313B886F506A08C1BADDA94CF`,
      'Content-Type': 'application/json',
    };
    const beamsAuthBody = {
      interests: [conversationId],
      web: {
        notification: {
          title: `New message from ${currentUser.name}`,
          body: message || 'You have a new message',
          deep_link: `https://https://messenger-delta-fawn.vercel.app/conversations/${conversationId}`,
        },
      },
    };

    await axios.post(beamsAuthUrl, beamsAuthBody, { headers: beamsAuthHeaders });

    return NextResponse.json(newMessage);

    }catch(error:any){
        console.error(error, 'ERROR_MESSAGES');
        return new NextResponse('InternalError', { status: 500 });
    }
}