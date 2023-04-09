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