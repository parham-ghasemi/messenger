'use client'

import Avatar from "@/app/components/Avatar"
import { FullMesseageType } from "@/app/types"
import clsx from "clsx"
import { format } from "date-fns"
import Image from "next/image"
import { useState } from "react"
import ImageModal from "@/app/components/ImageModal"

interface MessageBoxProps {
  data: FullMesseageType;
  isLast: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const container = clsx('flex gap-3 p-4 select-none');
  const body = clsx('flex flex-col gap-2');
  const message = clsx(
    'text-sm w-fit overflow-hidden',
    'bg-neutral-200',
    data.image ? 'rounded-md p-0' : 'rounded-full py-2 px-3'
  );

  return (
    <div className={container}>
      <div>
        <Avatar user={data.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">
            {data.sender.name}
          </div>
          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt), 'p')}
          </div>
        </div>

        <div className={message}>
          <ImageModal 
            src={data.image} 
            isOpen={imageModalOpen} 
            onClose={() => setImageModalOpen(false)} 
          />

          {data.image ? (
            <Image 
              onClick={() => setImageModalOpen(true)} 
              alt='image' 
              height="288" 
              width="288" 
              src={data.image} 
              className="object-cover cursor-pointer hover:scale-110 transition translate" 
            />
          ) : (
            <div>{data.body}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageBox
