'use client';

import React, { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { FiAlertTriangle } from 'react-icons/fi'
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/Modal';
import Button from '@/app/components/Button';
import useConversation from '@/app/hooks/useConversation';

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onLeave: () => void;
  isLoading: boolean;
  title: string;
  description?: string;
}

const ConfirmRemoveModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onLeave,
  isLoading,
  title,
  description
}) => {

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex sm:items-start">
        <div
          className="
            mx-auto 
            flex 
            h-12 
            w-12 
            flex-shrink-0 
            items-center 
            justify-center 
            rounded-full 
            bg-red-100 
            sm:mx-0 
            sm:h-10 
            sm:w-10
          "
        >
          <FiAlertTriangle
            className="h-6 w-6 text-red-600"
            aria-hidden="true"
          />
        </div>
        <div
          className="
            mt-3 
            text-center 
            sm:ml-4 
            sm:mt-0 
            sm:text-left
          "
        >
          <Dialog.Title
            as="h3"
            className="text-base font-semibold leading-6 text-gray-900"
          >
            {title}
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {
                description && description
              }
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 flex flex-row-reverse">
        <Button
          disabled={isLoading}
          danger
          onClick={onLeave}
        >
          Confirm
        </Button>
        <Button
          disabled={isLoading}
          secondary
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  )
}

export default ConfirmRemoveModal;