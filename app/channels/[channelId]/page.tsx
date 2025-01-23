import getChannelById from "@/app/actions/getChannelById";
import { getChannelMessages } from "@/app/actions/getMessages";
import EmptyState from "@/app/components/EmptyState";
import Header from "./components/Header";
import Body from "./components/Body";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { redirect } from "next/navigation";
// import Form from "./components/Form";

interface IParams {
  channelId: string;
}

const ChannelId = async ({ params }: { params: IParams }) => {
  const channel = await getChannelById(params.channelId);
  const messages = await getChannelMessages(params.channelId);
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect('/access-denied')
  }

  if (!channel) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    )
  }

  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Header channel={channel} currentUserId={currentUser.id} />
        <Body isMember={channel.memberIds.includes(currentUser.id)} currentUser={currentUser} channel={channel} initialMessages={messages} />
        {/* <Form /> */}
      </div>
    </div>
  )
}

export default ChannelId;
