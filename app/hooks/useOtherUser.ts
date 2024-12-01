
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { User } from "@prisma/client";

const useOtherUser = (conversation: FullConversationType | {
    users: User[]
}) => {
    const session = useSession();
    const otherUser = useMemo(()=>{
        const currentUserphoneNumber = session?.data?.user?.phoneNumber;

        const otherUser = conversation.users.filter((user) => user.phoneNumber !== currentUserphoneNumber);

        return otherUser[0];
    },[session?.data?.user?.phoneNumber, conversation.users]);

    return otherUser;
}

export default useOtherUser