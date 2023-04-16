import chatService from "$lib/services/chatService";
import userService from "$lib/services/userService";
import { gameIo } from "$lib/sockets/gameSocket";
import { appState } from "$lib/store/appState";
import { chatState } from "$lib/store/chatState";
import { currentGameId, gameStats, gameStatus, isGameHost } from "$lib/store/gameState";

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

export function resetGame() {
    gameIo.disconnect();
    gameStatus.set(null);
    gameStats.set(null);
    isGameHost.set(false);
    currentGameId.set(null);
}