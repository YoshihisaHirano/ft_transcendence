/** @type {import('./$types').PageServerLoad} */
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createBackendUrl, addAuthHeader } from '$lib/services/settings';
import type { Chat } from '$lib/types/types';

export const load: PageServerLoad = async ({ params, cookies, fetch }) => {
	const id = params.slug;
	const authToken = cookies.get('user-token');
	const getChatEndpoint = `chat/chatbyid/${id}/`;
	let chatRaw: any = null;
	try {
		chatRaw = await fetch(createBackendUrl(getChatEndpoint), {
			headers: {
				...addAuthHeader(authToken || '')
			}
		});	
	} catch (error) {
		chatRaw = null;
	}
    let chat: Chat | Error | null = null;
	if (chatRaw) {
		try {
			chat = await chatRaw.json();   
		} catch (error) {
			// console.error(error);
			chat = null;
		}
	}
	if (chat && 'message' in chat) {
		throw redirect(308, '/chatrooms');
	} else if (chat && chat.chatname) {
		return { name: chat.chatname };
	} else {
        throw redirect(308, '/404');
    }
};
