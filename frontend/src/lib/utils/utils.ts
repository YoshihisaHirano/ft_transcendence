import userService from "$lib/services/userService";
import { chatState } from "$lib/store/chatState";
import type { Chat } from "$lib/types/types";

export function userBanned(id: string, chatId: string) {
    if (chatId) {
        let chats: Chat[] = [];
        chatState.subscribe((val) => {
            chats = val;
        })
        const chatIdx = chats.findIndex(item => item.chatId === chatId);
        if (chatIdx < 0) {
            return false;
        }
        if (chats[chatIdx].banList.includes(id)) {
            return true;
        }
    }
    return false;
}

export async function userBlocked(userId: string, chat: Chat) {
    if (!chat.isDirect) {
        return false;
    }
    const chatMateId = chat.members.find(item => item.id !== userId);
    if (!chatMateId) {
        return false;
    }
    const chatMate = await userService.getUserById(chatMateId.id);
    if (!chatMate) {
        return false;
    }

    console.log(chatMate);
    return chatMate.blacklist.includes(userId);
}