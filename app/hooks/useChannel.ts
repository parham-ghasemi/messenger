
import { useParams } from "next/navigation";
import { useMemo } from 'react'

const useChannel = () =>{
    const params = useParams();

    const channelId = useMemo(()=>{
        if(!params?.channelId){
            return '';
        }
        return params.channelId as string;
    }, [params?.channelId])

    const isChannelOpen = useMemo(()=> !!channelId, [channelId]);


    return useMemo(()=>({
        isChannelOpen, channelId
    }), [isChannelOpen, channelId]);
}

export default useChannel;