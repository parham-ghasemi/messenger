// Disabled Image uploading
'use client'

import useConversation from "@/app/hooks/useConversation"
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { CldUploadButton } from "next-cloudinary";
import { useState } from "react";
import UnAvalableModal from "@/app/components/UnAvalableModal";

const Form = () => {
    const { conversationId } = useConversation();
    const [unAvalableOpen, setUnAvalableOpen] = useState(false);

    const {register, handleSubmit, setValue, formState:{errors}} = useForm<FieldValues>({
        defaultValues: {
            message: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setValue('message', '', { shouldValidate: true })
        axios.post('/api/messages', {...data, conversationId})
    }

    const handleUpload = (result : any) => {
        axios.post('/api/messages', {image: result?.info?.secure_url, conversationId})
    }


    return(
        // <div className=" py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
        //     <CldUploadButton options={{ maxFiles: 1}} onUpload={handleUpload} uploadPreset="messenger" >
        //         <HiPhoto size={30} className="text-sky-500" />
        //     </CldUploadButton>
        //     <form action="" onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 lg:gap-4 w-full">
        //         <MessageInput id="message" register={register} errors={errors} required placeholder="write a message..." />
        //         <button type="submit" className="rounded-full p-2 cursor-pointer hover:bg-sky-600 bg-sky-500 transition">
        //             <HiPaperAirplane size={18} className="text-white" />
        //         </button>
        //     </form>
        // </div>

        <>
          <UnAvalableModal isOpen={unAvalableOpen} onClose={() => setUnAvalableOpen(false)} />
          <div className=" py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
              <HiPhoto size={30} className="text-sky-500 cursor-pointer" onClick={() => setUnAvalableOpen(true)}/>
              <form action="" onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 lg:gap-4 w-full">
                  <MessageInput id="message" register={register} errors={errors} required placeholder="write a message..." />
                  <button type="submit" className="rounded-full p-2 cursor-pointer hover:bg-sky-600 bg-sky-500 transition">
                      <HiPaperAirplane size={18} className="text-white" />
                  </button>
              </form>
          </div>
        </>
    )
}

export default Form
