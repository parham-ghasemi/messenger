
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

    const isOpen = useMemo(()=> !!channelId, [channelId]);


    return useMemo(()=>({
        isOpen, channelId
    }), [isOpen, channelId]);
}

export default useChannel;