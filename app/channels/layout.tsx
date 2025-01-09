import getChannels from "../actions/getChannels";
import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import ChannelList from "./components/ChannelList";

export default async function ChannelsLayout({ children }: { children: React.ReactNode }) {
  const channels = await getChannels();
  const users = await getUsers();

  return (
    <Sidebar>
      <div className="h-full">
        <ChannelList users={users} initialItems={channels} />
        {children}
      </div>
    </Sidebar>
  )
}