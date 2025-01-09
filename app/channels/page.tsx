'use client'

import clsx from "clsx"
import useConversation from "../hooks/useConversation"
import EmptyState from "../components/EmptyState"
import useChannel from "../hooks/useChannel"
const Home = () => {
    const { isChannelOpen } = useChannel();

    return(
        <div className={clsx('lg:pl-80 h-full lg:block', isChannelOpen ? 'block' : 'hidden')}>
            <EmptyState />
        </div>
    )
}

export default Home