
import prisma from '@/app/libs/prismadb'
import getCurrentUser from './getCurrentUser'

const getConversationById = async ( conversationId : string) => {
    try{
        const currentUser = await getCurrentUser();

        if(!currentUser?.phoneNumber){
            return null;
        }

        const channel = await prisma.channel.findUnique({
            where: {
                id: conversationId
            },
            include: {
              owner: true,
              members: true,
            }
        });

        return channel

    }catch(error:any){
        console.error('getConversationById: ', error)
        return null;
    }
};

export default getConversationById