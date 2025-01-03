'use client'

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes"
import MobileItem from "./MobileItem";
import { useState } from "react";
import Avatar from "../Avatar";
import { User } from "@prisma/client";
import SettingsModal from "./SettingsModal";

interface MobileFooterProps {
  currentUser: User;
}

const MobileFooter: React.FC<MobileFooterProps> = ({ currentUser }) => {

  const routes = useRoutes();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { isOpen } = useConversation();

  if (isOpen) {
    return null;
  }

  return (
    <>
      <SettingsModal currentUser={currentUser} isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      <div className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] lg:hidden">
        {routes.map((route) => (
          <MobileItem
            key={route.href}
            href={route.href}
            icon={route.icon}
            active={route.active}
            // onClick={route.onClick}
          />
        ))}
        <nav className="px-4 flex flex-col justify-between items-center w-full">
          <div onClick={() => setIsSettingsOpen(true)} className=" cursor-pointer hover:opacity-75 transition">
            <Avatar user={currentUser} />
          </div>
        </nav>
      </div>
    </>
  )
}

export default MobileFooter