
import { useParams } from "next/navigation";
import { useMemo } from 'react'

const useConversation = () =>{
    const params = useParams();

    const conversationId = useMemo(()=>{
        if(!params?.conversationId){
            return '';
        }
        return params.conversationId as string;
    }, [params?.conversationId])

    const isConversationOpen = useMemo(()=> !!conversationId, [conversationId]);


    return useMemo(()=>({
        isConversationOpen, conversationId
    }), [isConversationOpen, conversationId]);
}

export default useConversation;