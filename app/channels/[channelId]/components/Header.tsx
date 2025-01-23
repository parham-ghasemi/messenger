'use client'

import { Channel, User } from "@prisma/client"
import Link from "next/link";
import { useState } from "react";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import ChannelDrawer from "./ChannelDrawer";
import useActiveList from "@/app/hooks/useActiveList";
import { MdTag } from "react-icons/md";

interface HeaderProps {
  channel: Channel & {
    owner: User,
    members: User[]
  }
  currentUserId: string
}

const Header: React.FC<HeaderProps> = ({ channel, currentUserId }) => {

  const [drawerOpen, setDrawerOpen] = useState(false);

  const { members } = useActiveList();
  const statusText = channel.members.length + ' members';

  return (
    <>
      <ChannelDrawer
        data={channel}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        currentUserId={currentUserId}
      />

      <div
        className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
        <div className="flex gap-3 items-center">
          <Link href='/channels' className="lg:hidden block text-teal-500 hover:text-teal-600 transition cursor-pointer">
            <HiChevronLeft size={32} />
          </Link>
          <div className="flex items-center justify-center w-10 h-10 bg-purple-200 rounded-lg">
            <MdTag size={20} className="text-purple-500" />
          </div>
          <div
            className="cursor-pointer flex flex-col"
            onClick={() => setDrawerOpen(true)}
          >
            <div>
              {channel.name}
            </div>
            <div className="text-sm font-light text-neutral-500">
              {statusText}
            </div>
          </div>
        </div>
        <HiEllipsisHorizontal size={32} onClick={() => setDrawerOpen(true)} className="text-teal-500 cursor-pointer hover:text-teal-600 transition" />
      </div>
    </>
  )
}
export default Header