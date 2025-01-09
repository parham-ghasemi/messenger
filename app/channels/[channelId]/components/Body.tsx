'use client'

import { FullMesseageType } from "@/app/types"
import { useEffect, useRef, useState } from "react"
import MessageBox from "./MessageBox"
import axios from "axios"
import { pusherClient } from "@/app/libs/pusher"
import { find } from "lodash"
import Form from "./Form"
import { Channel, User } from "@prisma/client"

interface BodyProps {
  initialMessages: FullMesseageType[]
  channel: Channel
  currentUser: User | null
}

const Body: React.FC<BodyProps> = ({ initialMessages, channel, currentUser }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  if(!currentUser || !currentUser.id){
    return null; // Add proper return statement
  }
  
  const isOwner = currentUser?.id === channel.ownerId;

  useEffect(() => {
    // Change channel name format
    const channelName = `channel_${channel.id}`;
    pusherClient.subscribe(channelName);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMesseageType) => {
      // axios.post(`/api/channels/${channel.id}/seen`);
      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }
        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: FullMesseageType) => {
      setMessages((current) => current.map((currentMessage) => {
        if (currentMessage.id === newMessage.id) {
          return newMessage;
        }
        return currentMessage;
      }));
    };

    pusherClient.bind('messages:new', messageHandler);
    pusherClient.bind('message:update', updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(channelName);
      pusherClient.unbind('messages:new', messageHandler);
      pusherClient.unbind('message:update', updateMessageHandler);
    };
  }, [channel.id]);

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        {messages.map((message, i) => (
          <MessageBox 
            isLast={i === messages.length - 1} 
            key={message.id} 
            data={message} 
          />
        ))}
        <div ref={bottomRef} className="pt-24" />
      </div>
      {isOwner && <Form channelId={channel.id} />}
    </>
  )
}

export default Body
