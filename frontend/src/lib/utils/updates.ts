import chatService from "$lib/services/chatService";
import userService from "$lib/services/userService";
import { appState } from "$lib/store/appState";
import { chatState } from "$lib/store/chatState";

export async function updateUser(userId: string) {
    const user = await userService.getUserById(userId as string);
    appState.update(() => ({
        user: user || null
    }));
}

export async function updateChats(userId: string) {
    const chats = await chatService.getChatsByUserId(userId);
    chatState.set(chats);
}