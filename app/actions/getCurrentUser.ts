
import prisma from "@/app/libs/prismadb"
import getSession from "./getSession"

const getCurrentUser = async () =>{
    try{
        const session = await getSession();
        if (!session?.user?.phoneNumber){
            return null;
        }
        const currentUser = await prisma.user.findUnique({
            where:{
                phoneNumber: session.user.phoneNumber as string
            }
        });
         if(!currentUser){
            return null;
         }
         return currentUser;

    }catch (error: any){
        return null;
    }
}

export default getCurrentUser