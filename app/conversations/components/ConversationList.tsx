'use client'

import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface ConversationListProps{
    initialItems: FullConversationType[];
    users: User[];
}

const ConversationList: React.FC<ConversationListProps> = ({initialItems, users}) => {
    const session = useSession();
    const[items, setItems] = useState(initialItems);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter();

    const { conversationId, isOpen } = useConversation();

    const pusherkey = useMemo(() => {
      return session.data?.user?.phoneNumber;
    }, [session.data?.user?.phoneNumber]);

    useEffect(() => {
      if(!pusherkey){
        return;
      }

      pusherClient.subscribe(pusherkey);

      const newHandler = (conversation: FullConversationType) => {
        setItems((current) => {
          if(find(current, { id: conversationId})){
            return current;
          }

          return [conversation, ...current]
        })
      }

      const updateHandler = (conversation: FullConversationType) => {
        setItems((currnet) => currnet.map((currnetConversation) => {
          if(currnetConversation.id === conversation.id){
            return {...currnetConversation, messages: conversation.messages}
          }

          return currnetConversation
        }))
      }

      const removeHandler = (conversation: FullConversationType) => {
        setItems((current) => {
          return [...current.filter((convo) => convo.id !== conversation.id)]
        })

        if(conversationId === conversation.id){
          router.push('/conversations');
        }
      }

      pusherClient.bind('conversation:new', newHandler);
      pusherClient.bind('conversation:update', updateHandler);
      pusherClient.bind('conversation:remove', removeHandler);

      return () => {
        pusherClient.unsubscribe(pusherkey);
        pusherClient.unbind('conversation:new', newHandler);
        pusherClient.unbind('conversation:update', updateHandler);
        pusherClient.unbind('conversation:remove', removeHandler);
      }
    }, [pusherkey, conversationId, router])

    return(
      <>
        <GroupChatModal users={users} isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} />

        <aside className={clsx('fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200', isOpen ? 'hidden' : "block w-full left-0")}>
            <div className="">
                <div className="flex justify-between py-4 bg-neutral-200 border-b border-neutral-400 px-5 items-center">
                    <div className="text-2xl font-bold text-neutral-800">
                        Messages
                    </div>
                    <div onClick={() => setIsModalOpen(true)} className="rounded-full text-gray-600 cursor-pointer hover:opacity-75 transition">
                        <MdOutlineGroupAdd size={20} />
                    </div>
                </div>

                <div className="mt-1 px-1">
                    {
                     items.map((item)=>(
                        <ConversationBox key={item.id} data={item} selected={conversationId === item.id} />
                     ))
                    }
                </div>
            </div>
        </aside>
      </>
    )
}

export default ConversationList