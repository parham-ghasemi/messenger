import getChannels from "../actions/getChannels";
import Sidebar from "../components/sidebar/Sidebar";
import ChannelList from "./components/ChannelList";

export default async function ChannelsLayout({ children }: { children: React.ReactNode }) {
  const channels = await getChannels();

  return (
    <Sidebar>
      <div className="h-full">
        <ChannelList initialItems={channels} />
        {children}
      </div>
    </Sidebar>
  )
}