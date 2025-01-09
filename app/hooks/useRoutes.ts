
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiChat, HiOutlineHashtag } from "react-icons/hi";
import { HiUsers } from "react-icons/hi2";
import { signOut } from "next-auth/react";
import useConversation from "./useConversation";
import useChannel from "./useChannel";

const useRoutes = () =>{
    const pathname = usePathname();
    const { conversationId } = useConversation();
    const { channelId } = useChannel();

    const routes = useMemo(()=>[
        {
            label: 'Users',
            href: '/users',
            icon: HiUsers,
            active: pathname === '/users'
        },
        {
            label: 'Chat',
            href: '/conversations',
            icon: HiChat,
            active: pathname === '/conversations' || !!conversationId,
        },
        {
            label: 'Channel',
            href: '/channels',
            icon: HiOutlineHashtag,
            active: pathname === '/channels' || !!channelId,
        },
    ], [pathname, conversationId])

    return routes;
}

export default useRoutes;