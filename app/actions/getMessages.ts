
import prisma from '@/app/libs/prismadb'

export async function getConversationMessages(conversationId:string) {
    try{
        const messages = await prisma.message.findMany({
            where: {
                conversationId: conversationId
            },
            include: {
                sender: true,
                seen: true,
                replyTo: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        return messages
    }catch(error:any){
        return []
    }
}

export async function getChannelMessages(channelId:string) {
    try{
        const messages = await prisma.message.findMany({
            where: {
                channelId: channelId
            },
            include: {
                sender: true,
                seen: true,
                replyTo: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        return messages
    }catch(error:any){
        return []
    }
}