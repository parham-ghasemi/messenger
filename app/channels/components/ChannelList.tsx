'use client'

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MdAddBox } from "react-icons/md";
import clsx from "clsx";
import { find } from "lodash";
import { useSession } from "next-auth/react";

import { FullChannelType } from "@/app/types";
import { pusherClient } from "@/app/libs/pusher";
import useChannel from "@/app/hooks/useChannel";
import ChannelBox from "./ChannelBox";
import CreateChannelModal from "./CreateChannelModal";

interface ChannelListProps {
  initialItems: FullChannelType[];
  users: User[]
}

const ChannelList: React.FC<ChannelListProps> = ({ initialItems, users }) => {
  const session = useSession();
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const { channelId, isChannelOpen : isChannelOpen } = useChannel();

  const pusherKey = useMemo(() => {
    return session.data?.user?.phoneNumber;
  }, [session.data?.user?.phoneNumber]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    // Subscribe to both user channel and general channels
    pusherClient.subscribe('channels');
    pusherClient.subscribe(pusherKey);

    const newHandler = (channel: FullChannelType) => {
      setItems((current) => {
        if (find(current, { id: channel.id })) {
          return current;
        }
        return [channel, ...current];
      });
    };

    const updateHandler = (channel: FullChannelType) => {
      setItems((current) => current.map((currentChannel) => {
        if (currentChannel.id === channel.id) {
          return { ...currentChannel, messages: channel.messages };
        }
        return currentChannel;
      }));
    };

    const removeHandler = (channel: FullChannelType) => {
      setItems((current) => {
        return [...current.filter((chan) => chan.id !== channel.id)];
      });

      if (channelId === channel.id) {
        router.push('/channels');
      }
    };

    pusherClient.bind('channel:new', newHandler);
    pusherClient.bind('channel:update', updateHandler);
    pusherClient.bind('channel:remove', removeHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unsubscribe('channels');
      pusherClient.unbind('channel:new', newHandler);
      pusherClient.unbind('channel:update', updateHandler);
      pusherClient.unbind('channel:remove', removeHandler);
    };
  }, [pusherKey, channelId, router]);

  return (
    <>
      <CreateChannelModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <aside className={clsx(
        'fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 overflow-x-hidden',
        isChannelOpen ? 'hidden' : 'block w-full left-0'
      )}>
        <div className="">
          <div className="flex justify-between py-4 bg-emerald-50 border-b border-neutral-400 px-5 items-center">
            <div className="text-2xl font-bold text-neutral-800">
              Channels
            </div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="rounded-full text-gray-600 cursor-pointer hover:opacity-75 transition"
            >
              <MdAddBox size={20} />
            </div>
          </div>

          <div className="mt-1 px-1">
            {items.map((item) => (
              <ChannelBox
                key={item.id}
                data={item}
                selected={channelId === item.id}
              />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default ChannelList;
