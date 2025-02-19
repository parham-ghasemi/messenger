'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { User } from '@prisma/client';
import { CldUploadButton } from 'next-cloudinary';
import clsx from "clsx"
import Input from "../inputs/Input";
import Modal from '../Modal'
import Button from '../Button';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { HiArrowLeftOnRectangle } from 'react-icons/hi2';
import { signOut } from 'next-auth/react';

interface SettingsModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentUser: User;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser = {}
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);


  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image
    }
  });

  const image = watch('image');

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios.post('/api/settings', data)
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error('Something went wrong!'))
      .finally(() => setIsLoading(false));
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'messenger');

      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setValue('image', data.secure_url, { shouldValidate: true });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error('Failed to upload image.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2
                className="
                text-base 
                font-semibold 
                leading-7 
                text-gray-900
              "
              >
                Profile
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Edit your public information.
              </p>

              <div className="mt-10 flex flex-col gap-y-8">
                <Input
                  disabled={isLoading}
                  label="Name"
                  id="name"
                  errors={errors}
                  required
                  register={register}
                />

                <div>
                  <label
                    htmlFor="photo"
                    className="
                    block 
                    text-sm 
                    font-medium 
                    leading-6 
                    text-gray-900
                  "
                  >
                    Photo
                  </label>
                  <div className="mt-2 flex items-center gap-x-3">
                    <Image
                      width="48"
                      height="48"
                      className="rounded-full"
                      src={image || currentUser?.image || '/images/placeholder-avatar.jpg'}
                      alt="Avatar"
                    />

                    <input
                      type="file"
                      accept="image/*"
                      id="file-input"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('file-input')?.click()}
                      className="group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-5">
                  <p>Logout</p>
                  <div className="bg-red-500 px-2 py-1.5 rounded-md cursor-pointer w-fit hover:bg-red-600 hover:text-white text-neutral-200" onClick={() => signOut()}>
                    <HiArrowLeftOnRectangle size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="
            mt-6 
            flex 
            items-center 
            justify-end 
            gap-x-6
          "
          >
            <Button
              disabled={isLoading}
              secondary
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              type="submit"
            >
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </>

  )
}

export default SettingsModal;
