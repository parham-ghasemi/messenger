'use client'
import addMember from "@/app/actions/addMember"
import LoadingModal from "@/app/components/LoadingModal"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

const JoinBtn = ({ channelId, currentUserId }: { channelId: string, currentUserId: string }) => {
  const [loading, setloading] = useState(false)
  const [hadError, setHadError] = useState(false)
  const router = useRouter();

  const handleJoin = async () => {
    setloading(true)
    await addMember(channelId,)
      .catch((e: any) => {
        toast.error('Something went wrong')
        setHadError(true)
      })
      .finally(() => {
        setloading(false)
        if (!hadError) {
          router.refresh()
        }
      })
  }

  return (
    <button
      onClick={handleJoin}
      className="py-3 bg-sky-600 text-neutral-200 border-t flex gap-2 lg:gap-4 w-full cursor-pointer hover:bg-sky-700 hover:text-white transition-colors duration-300 justify-center items-center text-xl font-semibold"
    >
      {
        loading ? (
          <div className="">
            Joining...
            <LoadingModal />
          </div>
        ) : (
          <div className="">
            Join
          </div>
        )
      }
    </button>
  )
}

export default JoinBtn