// Disabled Change Avatar
'use client';

import axios from 'axios';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { User } from '@prisma/client';
// import { CldUploadButton } from 'next-cloudinary';

import Input from "../inputs/Input";
import Modal from '../Modal'
import Button from '../Button';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import UnAvalableModal from '../UnAvalableModal';

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
  const [unAvalableOpen, setUnAvalableOpen] = useState(false);

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

  const handleUpload = (result: any) => {
    setValue('image', result.info.secure_url, {
      shouldValidate: true
    });
  }

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

  return (
    <>
      <UnAvalableModal isOpen={unAvalableOpen} onClose={() => setUnAvalableOpen(false)} />
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
                    {/* <CldUploadButton
                      options={{ maxFiles: 1 }}
                      onUpload={handleUpload}
                      uploadPreset="messenger"
                    >
                      <Button
                        disabled={isLoading}
                        secondary
                        type="button"
                      >
                        Change
                      </Button>
                    </CldUploadButton> */}
                    <Button type='button' secondary onClick={() => setUnAvalableOpen(true)}>
                      Change
                    </Button>
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
