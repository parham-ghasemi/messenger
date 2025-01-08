import prisma from "@/app/libs/prismadb"
import getCurrentUser from "./getCurrentUser"

const getChannels = async () => {
    const currentUser = await getCurrentUser();

    if(!currentUser?.id) {
        return [];
    }

    try {
        const channels = await prisma.channel.findMany({
            orderBy: {
                updatedAt: 'desc'
            },
            where: {
                OR: [
                    {
                        ownerId: currentUser.id
                    },
                    {
                        memberIds: {
                            has: currentUser.id
                        }
                    }
                ]
            },
            include: {
                owner: true,
                members: true,
                messages: {
                    include: {
                        sender: true,
                        seen: true
                    }
                }
            }
        });

        return channels;
    } catch(error: any) {
        return [];
    }
}

export default getChannels;
