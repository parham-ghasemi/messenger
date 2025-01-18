'use client'

import { User } from "@prisma/client"
import Image from "next/image";
import useActiveList from "@/app/hooks/useActiveList";

interface AvatarProps{
    user: User;
}

const ProfileDrawerAvatar: React.FC<AvatarProps> = ({user}) =>{
  const { members } = useActiveList();
  const isActive = members.indexOf(user?.phoneNumber!) !== -1;

  return(
      <div className="relative">
          <div className="relative inline-block rounded-full overflow-hidden w-10 h-10 md:h-16 md:w-16">
              <Image alt="Avatar" src={user?.image || '/images/placeholder-avatar.jpg'} fill />
              {/* <Image alt="Avatar" src={'/images/placeholder-avatar.jpg'} fill /> */}
          </div>
          {
            isActive && (
              <span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3" />
            )
          }
      </div>
  )
}

export default ProfileDrawerAvatar