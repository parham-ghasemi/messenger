'use client'

import { useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Message, User } from "@prisma/client"
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { FullChannelType } from "@/app/types";
import Avatar from "@/app/components/Avatar";
import { MdTag } from "react-icons/md";

interface ChannelBoxProps {
  data: FullChannelType;
  selected?: boolean;
}

const ChannelBox: React.FC<ChannelBoxProps> = ({ data, selected }) => {
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/channels/${data.id}`);
  }, [data.id, router]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    return messages[messages.length - 1]
  }, [data.messages])

  const userPhoneNumber = useMemo(() => {
    return session.data?.user?.phoneNumber;
  }, [session.data?.user?.phoneNumber])

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!userPhoneNumber) {
      return false;
    }

    return seenArray.filter((user) => user.phoneNumber === userPhoneNumber).length !== 0;
  }, [userPhoneNumber, lastMessage])

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return 'Sent an image';
    }

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return 'Welcome to the channel!';
  }, [lastMessage])

  console.log(data.color)

  return (
    <>
      <div
        onClick={handleClick}
        className={clsx(
          'w-full relative flex items-center space-x-3 hover:bg-purple-100 hover:rounded transition cursor-pointer p-3',
          selected ? 'bg-purple-100' : 'bg-white'
        )}
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{backgroundColor: data.color + '30'}}>
          <MdTag size={20} style={{color: data.color}} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <div className="flex justify-between items-center mb-1">
              <p className="text-md font-medium text-gray-900">
                {data.name}
              </p>
              {lastMessage?.createdAt && (
                <p className="text-xs text-gray-600 font-light">
                  {format(new Date(lastMessage.createdAt), 'p')}
                </p>
              )}
            </div>
            <p className={clsx(
              'truncate text-sm',
              hasSeen ? 'text-gray-500' : 'text-black font-medium'
            )}>
              {lastMessageText}
            </p>
          </div>
        </div>
      </div>
      <div className="h-px w-screen flex justify-start ps-14">
        <div className="h-full w-[80%] bg-slate-100"></div>
      </div>
    </>
  )
}

export default ChannelBox;
