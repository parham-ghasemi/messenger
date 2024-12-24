'use client'

import { useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Conversation, Message, User } from "@prisma/client"
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { FullConversationType } from "@/app/types";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";

interface ConversationBoxProps {
    data: FullConversationType;
    selected?: boolean
}

const ConversationBox:React.FC<ConversationBoxProps> = ({data, selected}) => {
    const otherUser = useOtherUser(data);
    const session = useSession();
    const router = useRouter();

    const handleClick = useCallback(()=>{
        router.push(`/conversations/${data.id}`);
    }, [data.id, router]);

    const lastMessage = useMemo(()=>{
        const messages = data.messages || [];
        return messages[messages.length-1]
    }, [data.messages])

    const userphoneNumber = useMemo(()=>{
        return session.data?.user?.phoneNumber;
    }, [session.data?.user?.phoneNumber])

    const hasSeen = useMemo(()=>{
        if(!lastMessage){
            return false;
        }

        const seenArrey = lastMessage.seen || [];

        if(!userphoneNumber){
            return false;
        }

        return seenArrey.filter((user) => user.phoneNumber === userphoneNumber).length !== 0;
    },[userphoneNumber, lastMessage])

    const lastMessageText = useMemo(()=>{
        if(lastMessage?.image) {
            return 'Sent an image';
        }

        if(lastMessage?.body){
            return lastMessage.body;
        }

        return 'Started a Conversation';
    }, [lastMessage])

    return(
        <div
            onClick={handleClick}
            className={clsx(' border-b border-neutral-300 w-full relative flex items-center space-x-3 hover:bg-neutral-200 hover:rounded transition cursor-pointer p-3', selected ? 'bg-neutral-200' : 'bg-white')}
        >
            {
              data.isGroup ? (
                <AvatarGroup users={data.users} />
              ) : (
                <Avatar user={otherUser} />
              )
            }

            <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-md font-medium text-gray-900">
                            {data.name || otherUser.name}
                        </p>
                        {lastMessage?.createdAt &&(
                            <p className="text-xs text-gray-600 font-light">
                                {format(new Date(lastMessage.createdAt), 'p')}
                            </p>
                        )}
                    </div>
                    <p className={clsx('truncate text-sm', hasSeen ? 'text-gray-500' : 'text-black font-medium')}>
                        {lastMessageText}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ConversationBox