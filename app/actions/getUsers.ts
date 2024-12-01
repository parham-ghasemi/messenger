
import prisma from "@/app/libs/prismadb"

import getSession from "./getSession"

const getUsers = async () => {
    const session = await getSession();
    if(!session?.user?.phoneNumber){
        return []
    }

    try{
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where:{
                NOT:{
                    phoneNumber: session.user.phoneNumber
                }
            }
        })

        return users
    }catch(error: any){
        return [];
    }
}

export default getUsers