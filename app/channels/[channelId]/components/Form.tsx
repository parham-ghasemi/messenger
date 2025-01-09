'use client'

import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import MessageInput from "@/app/components/MessageInput";
import { useState } from "react";
import UnAvalableModal from "@/app/components/UnAvalableModal";

interface FormProps {
  channelId: string;
}

const Form: React.FC<FormProps> = ({ channelId }) => {
  const [unAvalableOpen, setUnAvalableOpen] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      message: ''
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue('message', '', { shouldValidate: true })
    axios.post('/api/channel-message', {
      ...data,
      channelId
    });
  }

  return (
    <>
      <UnAvalableModal 
        isOpen={unAvalableOpen} 
        onClose={() => setUnAvalableOpen(false)} 
      />
      <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
        <HiPhoto 
          size={30} 
          className="text-teal-500 cursor-pointer" 
          onClick={() => setUnAvalableOpen(true)} 
        />
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="flex items-center gap-2 lg:gap-4 w-full"
        >
          <MessageInput 
            id="message" 
            register={register} 
            errors={errors} 
            required 
            placeholder="Write a message..." 
          />
          <button 
            type="submit" 
            className="rounded-full p-2 cursor-pointer hover:bg-teal-600 bg-teal-500 transition"
          >
            <HiPaperAirplane size={18} className="text-white" />
          </button>
        </form>
      </div>
    </>
  )
}

export default Form
