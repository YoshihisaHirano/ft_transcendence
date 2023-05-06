import userService from "$lib/services/userService";
import { chatState } from "$lib/store/chatState";
import type { Chat } from "$lib/types/types";
import { DEFAULT_FIELD_WIDTH } from "./constants";

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
        if (chats[chatIdx].banList.find((user) => user.id === id)) {
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

    // console.log(chatMate);
    return chatMate.blacklist.includes(userId);
}

export function findScaleCoefficient(canvasWidth: number) {
    return canvasWidth / DEFAULT_FIELD_WIDTH;
}