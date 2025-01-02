import { Conversation, Message, User } from "@prisma/client";

export type FullMesseageType = Message & {
    sender: User,
    seen: User[],
    replyTo?: Message | null
};

export type FullConversationType = Conversation & {
    users: User[],
    messages: FullMesseageType[],
};