/** @type {import('./$types').PageLoad} */
import chatService from '$lib/services/chatService';
import { chatState } from '$lib/store/chatState';
import type { Chat } from '$lib/types/types';
import { getFromStorage } from '$lib/utils/storage';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    const id = getFromStorage('userId');

    if (!id) return;
    let currentChatState: Chat[] = [];

    chatState.subscribe((val) => {
        currentChatState = val;
    })

    if (currentChatState.length) {
        return;
    }

    const chats = await chatService.getChatsByUserId(id);
    // console.log(chats);
    chatState.set(chats);
}