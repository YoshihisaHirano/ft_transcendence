/** @type {import('./$types').PageServerLoad} */
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { createBackendUrl, addAuthHeader } from "$lib/services/settings";
import type { Chat } from "$lib/types/types";

export const load: PageServerLoad = async ({ params, cookies, fetch }) => {
    const id = params.slug;
    const authToken = cookies.get('user-token');
    const getChatEndpoint = `chat/chatbyid/${id}/`;
    const chatRaw = await fetch(createBackendUrl(getChatEndpoint), {
		headers: {
			...addAuthHeader(authToken || '')
		}
	});
	const chat: Chat | Error = await chatRaw.json();
    if ('message' in chat) {
        throw redirect(308, '/chatrooms');
    }
    return {
        name: chat.chatname
    }
}