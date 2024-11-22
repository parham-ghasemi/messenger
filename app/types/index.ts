
import { Conversation, Message, User } from "@prisma/client";

export type FullMesseageType = Message & {
    sender: User,
    seen: User[]
};

export type FullConversationType = Conversation & {
    users: User[],
    messages: FullMesseageType[],
};