'use client'

import { User } from "@prisma/client"
import UserBox from "./UserBox";

interface UserListProps {
  items: User[];
};

const UserList: React.FC<UserListProps> = ({ items }) => {
  return (
    <aside className="fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 block w-full left-0">
      <div className=" px-5 text-2xl font-bold text-neutral-800 py-4 bg-emerald-50 border-b border-neutral-400">
        Users
      </div>
      <div className="px-1 mt-1">
        {items.map(item => <UserBox key={item.id} data={item} />)}
      </div>
    </aside>
  )
}

export default UserList