import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function getSession(){
    const serverSession = await getServerSession(authOptions);
    return serverSession;
}