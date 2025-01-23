'use client'

import { Channel, User } from "@prisma/client"
import { Fragment, useState } from "react"
import { Dialog, Transition } from '@headlessui/react'
import { IoClose } from "react-icons/io5"
import { format } from "date-fns"
import Avatar from "@/app/components/Avatar"
import { MdTag } from "react-icons/md"
import Link from "next/link"
import { FaRegCopy } from "react-icons/fa6"
import { TiTick } from "react-icons/ti"

interface ChannelDrawerProps {
  isOpen: boolean
  onClose: () => void
  data: Channel & {
    owner: User
    members: User[]
  }
}

const ChannelDrawer: React.FC<ChannelDrawerProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const [copied, setCopied] = useState<boolean>(false)

  const handleCopy = async (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000);
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className='relative z-50' onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-end">
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                            onClick={onClose}
                          >
                            <span className="sr-only">Close panel</span>
                            <IoClose size={24} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <div className="flex flex-col items-center">
                        <div className="mb-2">
                          <div className="flex items-center justify-center w-20 h-20 bg-purple-200 rounded-2xl">
                            <MdTag size={32} className="text-purple-500" />
                          </div>
                        </div>

                        <div className="text-2xl font-bold">{data.name}</div>
                        {data.description && (
                          <div className="text-sm text-gray-500 text-center mt-2">
                            {data.description}
                          </div>
                        )}

                        <div className="text-sm text-gray-500 flex gap-2 just">
                          <Link onClick={() => handleCopy(`messenger-delta-fawn.vercel.app/channels/${data.id}`)} href={`/channels/${data.id}`} className="hover:underline">
                            Channel id: {data.id}
                          </Link>
                          <button onClick={() => handleCopy(`messenger-delta-fawn.vercel.app/channels/${data.id}`)}>
                            {
                              copied ? <TiTick size={22} color="green" /> : <FaRegCopy size={16} />
                            }
                          </button>
                        </div>

                        <div className="w-full mt-8 pb-5 pt-5 sm:px-0 sm:pt-0">
                          <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                            <hr />
                            <div>
                              <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                                Owner
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                <div className="flex items-center gap-2">
                                  <Avatar user={data.owner} />
                                  <div>
                                    <p className="text-gray-900">{data.owner.name}</p>
                                    <p className="text-gray-500">{data.owner.phoneNumber}</p>
                                  </div>
                                </div>
                              </dd>
                            </div>

                            <hr />

                            <div>
                              <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                                Members ({data.members.length - 1})
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                <div className="flex flex-col gap-4">
                                  {data.members.map((member) => member.id !== data.owner.id && (
                                    <div key={member.id} className="flex items-center gap-2">
                                      <Avatar user={member} />
                                      <div>
                                        <p className="text-gray-900">{member.name}</p>
                                        <p className="text-gray-500">{member.phoneNumber}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </dd>
                            </div>

                            <hr />

                            <div>
                              <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                                Created
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                <time dateTime={data.createdAt.toISOString()}>
                                  {format(data.createdAt, 'PP')}
                                </time>
                              </dd>
                            </div>
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
  )
}

export default ChannelDrawer
