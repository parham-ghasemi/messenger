// Disabled delete conversation

'use client'

import useOtherUser from "@/app/hooks/useOtherUser"
import { Conversation, User } from "@prisma/client"
import { format } from "date-fns"
import { Fragment, useMemo, useState } from "react"
import { Dialog, Transition } from '@headlessui/react'
import { IoClose, IoTrash } from "react-icons/io5"
// import Avatar from "@/app/components/Avatar"
import ConfirmModal from "./ConfirmModal"
import AvatarGroup from "@/app/components/AvatarGroup"
import useActiveList from "@/app/hooks/useActiveList"
// import UnAvalableModal from "@/app/components/UnAvalableModal"
import ProfileDrawerAvatar from "./ProfileDrawerAvatar"

interface ProfileDrawerProps {
    isOpen: boolean
    onClose: () => void
    data: Conversation & {
        users: User[]
    }
}

const ProfileDrawer:React.FC<ProfileDrawerProps> = ({isOpen, onClose, data}) => {
    const otherUser = useOtherUser(data);
    const [confirmOpen, setConfirmOpen] = useState(false)
    // const [unAvalableOpen, setUnAvalableOpen] = useState(false)

    const { members } = useActiveList();
    const isActive = members.indexOf(otherUser?.phoneNumber!) !== -1;

    const joinDate = useMemo(()=>{
        return format(new Date(otherUser.createdAt), 'PP')
    }, [otherUser.createdAt])

    const title = useMemo(()=>{
        return data.name || otherUser.name
    }, [data.name, otherUser.name])

    const statusText = useMemo(()=>{
        if(data.isGroup){
            return `${data.users.length}`
        }

        return isActive ? 'Active' : 'Offline';

    }, [data, isActive])

    return (
      <>
      <ConfirmModal
        isOpen={confirmOpen} 
        onClose={() => setConfirmOpen(false)}
      />
      {/* <UnAvalableModal isOpen={unAvalableOpen} onClose={() => setUnAvalableOpen(false)} /> */}

        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className='relative z-50' onClose={onClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-500" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-500" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black bg-opacity-40" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className=" pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child as={Fragment} enter="transfrom transition ease-in-out duration-500" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-500" leaveTo="translate-x-full">
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                        <div className="px-4 sm:px-6">
                                            <div className="flex items-start justify-end">
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button type="button" onClick={onClose} className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                                                        <span className="sr-only">Close panel</span>
                                                        <IoClose size={24} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                            <div className="flex flex-col items-center">
                                                <div className="mb-2">
                                                  {
                                                    data.isGroup ? (
                                                      <AvatarGroup users={data.users} />
                                                    ) :
                                                    (
                                                      <ProfileDrawerAvatar user={otherUser} />
                                                    )
                                                  }
                                                </div>
                                                <div>{title}</div>
                                                <div className="text-sm text-gray-500">{statusText}</div>
                                                <div className="flex gap-10 my-8">
                                                    <div onClick={()=>setConfirmOpen(true)} className='flex flex-col gap-3 items-center cursor-pointer hover:opacity-75'>
                                                    {/* <div onClick={()=>setUnAvalableOpen(true)} className='flex flex-col gap-3 items-center cursor-pointer hover:opacity-75'> */}
                                                        <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                                                            <IoTrash size={20} />
                                                        </div>
                                                        <div className="text-sm font-light text-neutral-600">
                                                            Delete
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
                                                  <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                                                    {
                                                      data.isGroup && (
                                                        <div>
                                                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                                                            phoneNumbers
                                                          </dt>
                                                          <dd className="mt-1 text-sm  sm:col-span-2">
                                                            {
                                                              data.users.map((user) =>(
                                                                <div className="mt-3">
                                                                  <p className="text-gray-900">{user.name}</p>
                                                                  <p className="text-gray-600">{user.phoneNumber}</p>
                                                                </div>
                                                              ))
                                                            }
                                                          </dd>
                                                        </div>
                                                      )
                                                    }
                                                    {!data.isGroup && (
                                                      <div>
                                                        <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0" >
                                                          phoneNumber
                                                        </dt>
                                                        <dd className="mt-1 text-sm sm:col-span-2">
                                                          <p className="text-gray-900">{otherUser.phoneNumber}</p>
                                                        </dd>
                                                      </div>
                                                    )}
                                                    {!data.isGroup && (
                                                      <>
                                                        <hr />
                                                        <div>
                                                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                                                            Joined
                                                          </dt>
                                                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                                            <time dateTime={joinDate}>
                                                              {joinDate}
                                                            </time>
                                                          </dd>
                                                        </div>
                                                      </>
                                                    )}
                                                  </dl>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
      </>
    )
}

export default ProfileDrawer