'use client'

import React from 'react'
import { Dialog } from '@headlessui/react'
import { FiInfo } from 'react-icons/fi'
import Modal from '@/app/components/Modal';
import Button from '@/app/components/Button';

interface UnAvalableModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

const UnAvalableModal:React.FC<UnAvalableModalProps> = ({isOpen, onClose}) => {

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
            bg-sky-100
            sm:mx-0 
            sm:h-10 
            sm:w-10
          "
        >
          <FiInfo 
            className="h-6 w-6 text-teal-700" 
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
            WAIT!
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              This feature is not avalable yet :(
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <Button
          secondary
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </Modal>
  )
}
export default UnAvalableModal