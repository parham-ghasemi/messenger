import getConversationById from "@/app/actions/getConversationById";
import {getConversationMessages} from "@/app/actions/getMessages";
import EmptyState from "@/app/components/EmptyState";
import Header from "./components/Header";
import Body from "./components/Body";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { redirect } from "next/navigation";

interface IParams {
    conversationId : string;
}

const ConversationId = async ({ params }: { params: IParams }) => {
    const conversation = await getConversationById(params.conversationId);
    const messages = await getConversationMessages(params.conversationId);
    const currentUser = await getCurrentUser();

    if(!conversation){
        return(
            <div className="lg:pl-80 h-full">
                <div className="h-full flex flex-col">
                    <EmptyState />
                </div>
            </div>
        )
    }

    if(!currentUser || !conversation.userIds.includes(currentUser.id)){
      redirect('/access-denied')
    }

    return(
        <div className="lg:pl-80 h-full">
            <div className="h-full flex flex-col">
                <Header conversation={conversation} />
                <Body initialMessages={messages} />
                {/* <Form /> */}
            </div> 
            
            
        </div>
    )
}

export default ConversationId