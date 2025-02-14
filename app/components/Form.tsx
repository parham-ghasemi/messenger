'use client'

import useConversation from "@/app/hooks/useConversation"
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { FullMesseageType } from "@/app/types";
import { TiArrowBack } from "react-icons/ti"
import { CldUploadButton } from "next-cloudinary";

interface FormProps {
  replyToId: string | null;
  setReplyToId: (id: string | null) => void;
  replyTo: FullMesseageType | null;
  replyVisible: boolean
  setReplyVisible: (flag: boolean) => void;
}

const Form: React.FC<FormProps> = ({ replyToId, setReplyToId, replyTo, replyVisible, setReplyVisible }) => {
  const { conversationId } = useConversation();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      message: ''
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue('message', '', { shouldValidate: true })
    axios.post('/api/messages', { ...data, conversationId, replyToId })
      .then(() => {
        setReplyToId(null)
        setReplyVisible(false)
      });
  }

  const handleUpload = (result: any) => {
    axios.post('/api/messages', { image: result?.info?.secure_url, conversationId })
  }

  const handleCancelReply = () => {
    setReplyToId(null)
    setReplyVisible(false)
  }

  return (
    <div className=" py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <CldUploadButton options={{ maxFiles: 1 }} onUpload={handleUpload} uploadPreset="messenger" >
        <HiPhoto size={30} className="text-teal-500 cursor-pointer" />
      </CldUploadButton>
      <div className="w-full flex flex-col">
        {
          replyVisible && replyTo && (
            <div onClick={handleCancelReply} className="cursor-pointer text-xs ms-3 pb-1 flex items-center text-teal-600 gap-1">
              <TiArrowBack />
              {replyTo?.body}
            </div>
          )
        }
        <form action="" onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 lg:gap-4 w-full">
          <MessageInput id="message" register={register} errors={errors} required placeholder="write a message..." />
          <button type="submit" className="rounded-full p-2 cursor-pointer hover:bg-teal-600 bg-teal-500 transition">
            <HiPaperAirplane size={18} className="text-white" />
          </button>
        </form>

      </div>
    </div>
  )
}

export default Form