import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server"
import prisma from "@/app/libs/prismadb"

export async function POST(request:Request) {
    try{
        const currnetUser = await getCurrentUser();
        const body = await request.json();
        const {message, image, conversationId} = body;

        if(!currnetUser?.id || !currnetUser?.email){
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

        return NextResponse.json(newMessage);

    }catch(error:any){
        console.error(error, 'ERROR_MESSAGES');
        return new NextResponse('InternalError', { status: 500 });
    }
}