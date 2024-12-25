'use client'

import useConversation from "@/app/hooks/useConversation"
import { FullMesseageType } from "@/app/types"
import { useEffect, useRef, useState } from "react"
import MessageBox from "./messageBox"
import axios from "axios"
import { pusherClient } from "@/app/libs/pusher"
import { find } from "lodash"
import ContextMenu from "./ContextMenu"
import toast from "react-hot-toast"
import UnAvalableModal from "@/app/components/UnAvalableModal"

interface BodyProps {
  initialMessages: FullMesseageType[]
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {

  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [points, setPoints] = useState({ x: 0, y: 0 })
  const [isOwn, setIsOwn] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [unAvalabelOpen, setUnAvalableOpen] = useState(false)

  const { conversationId } = useConversation();

  useEffect(() => {
    const handleClick = () => setMenuOpen(false);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`)
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMesseageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current
        }

        return [...current, message]
      });

      bottomRef?.current?.scrollIntoView();
    }

    const updateMessageHandler = (newMessage: FullMesseageType) => {
      setMessages((current) => current.map((currentMessage) => {
        if (currentMessage.id === newMessage.id) {
          return newMessage;
        }
        return currentMessage
      }))
    };

    pusherClient.bind('messages:new', messageHandler)
    pusherClient.bind('message:update', updateMessageHandler)

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind('messages:new', messageHandler)
      pusherClient.unbind('message:update', updateMessageHandler)
    }
  }, [conversationId])

  const handleCopy = (text: string | null) => {
    text ? navigator.clipboard.writeText(text) : null;
    toast.success('Copied')
  }

  return (
    <>
      <UnAvalableModal isOpen={unAvalabelOpen} onClose={() => setUnAvalableOpen(false)} />
      {
        menuOpen && (
          <ContextMenu onDelete={() => setUnAvalableOpen(true)} handleCopy={() => handleCopy(text)} top={points.y} left={points.x} isown={isOwn} />
        )
      }
      <div className="flex-1 overflow-y-auto">
        {
          messages.map((message, i) => (
            <MessageBox setText={setText} setIsown={setIsOwn} setMenuOpen={setMenuOpen} setPoints={setPoints} isLast={i === messages.length - 1} key={message.id} data={message} />
          ))
        }
        <div ref={bottomRef} className="pt-24" />
      </div>
    </>
  )
}

export default Body