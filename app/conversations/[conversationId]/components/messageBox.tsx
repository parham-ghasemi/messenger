'use client'

import Avatar from "@/app/components/Avatar"
import { FullMesseageType } from "@/app/types"
import clsx from "clsx"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useEffect, useState } from "react"
import ImageModal from "./ImageModal"
import getMessageById from "@/app/actions/getMessageById"
import ContextMenu from "./ContextMenu"

interface MessageBoxProps {
  data: FullMesseageType;
  isLast: boolean;
  setPoints: ({ x, y }: { x: number, y: number }) => void;
  setMenuOpen: (x: boolean) => void;
  setIsown: (x: boolean) => void;
  setText: (text: string | null) => void;
  setReplyTo: (id: string | null) => void;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast, setPoints, setMenuOpen, setIsown, setText, setReplyTo }) => {

  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  // console.log(data.sender.name+' reply to : '+data.replyToId);

  useEffect(() => {
    if(data.replyToId){
      console.log(data.sender.name+' reply to : '+data.replyTo);
    }
  }, [data])

  const isOwn = session?.data?.user?.phoneNumber === data?.sender?.phoneNumber;
  const seenList = (data.seen || []).filter((user) => user.phoneNumber !== data?.sender?.phoneNumber).map((user) => user.name).join(', ');

  const container = clsx('flex gap-3 p-4 select-none', isOwn && 'justify-end');

  const avatar = clsx(isOwn && 'order-2')

  const body = clsx('flex flex-col gap-2 cursor-pointer', isOwn && 'items-end');

  const message = clsx('text-sm w-fit overflow-hidden', isOwn ? 'bg-sky-500 text-white' : 'bg-neutral-200', data.image ? 'rounded-md p-0' : 'rounded-full py-2 px-3');

  const reply = clsx("text-xs w-fit overflow-hidden rounded-full py-2 px-3", isOwn ? 'bg-sky-400 text-white' : 'bg-neutral-200');


  // useEffect(() => {
  //   const fetchMessage = async () => {
  //     try {
  //       let fetchedMessageText;
  //       if (data.replyToId) {
  //         const fetchedMessage = await getMessageById(data.replyToId);
  //         fetchedMessageText = fetchedMessage?.body;
  //       }
  //       setReplyText(fetchedMessageText ? fetchedMessageText : null);
  //     } catch (error) {
  //       console.error("Failed to fetch message:", error);
  //     }
  //   };

  //   fetchMessage();
  // }, [data.replyToId]);

  // useEffect(()=> {
  //   const fetchMessage = async () => {
  //     try{
  //       console.log('TRYING');
  //       let fetchedMessageText;
  //       if(data.replyToId){
  //         console.log(data.sender.name + ': ' + data.replyToId)
  //         const fetchedMessage = await getMessageById(data.replyToId)
  //       }
  //     } catch (error:any) {
  //       console.error('errorFetchingMessage: ', error)
  //     }
  //   }

  //   fetchMessage();
  // }, [data.replyToId])


  return (
    <>
      <div
        className={container}
      >
        <div className={avatar}>
          <Avatar user={data.sender} />
        </div>
        <div
          className={body}
          onContextMenu={(e) => {
            e.preventDefault();
            setMenuOpen(true);
            setIsown(isOwn);
            setText(data.body)
            setReplyTo(data.id)
            setPoints({
              x: e.pageX,
              y: e.pageY
            })
          }}
        >
          <div className="flex items-center gap-1">
            <div className="text-sm text-gray-500">
              {data.sender.name}
            </div>
            <div className="text-xs text-gray-400">
              {format(new Date(data.createdAt), 'p')}
            </div>
          </div>

          {
            data.replyTo && (
              <div className={reply}>{data.replyTo.body}</div>
            )
          }

          <div className={message}>
            <ImageModal src={data.image} isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)} />

            {data.image ? (
              <Image onClick={() => setImageModalOpen(true)} alt='image' height="288" width="288" src={data.image} className="object-cover cursor-pointer hover:scale-110 transition translate" />
            ) : (
              <div>{data.body}</div>
            )}
          </div>
          {isLast && isOwn && seenList.length > 0 && (
            <div className="text-xs font-light text-gray-500">
              {`Seen by ${seenList}`}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default MessageBox