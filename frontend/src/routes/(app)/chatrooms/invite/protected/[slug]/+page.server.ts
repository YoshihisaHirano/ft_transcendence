/** @type {import('./$types').PageServerLoad} */
import chatService from "$lib/services/chatService";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const chat = await chatService.getChatById(params.slug);
    if (!chat) {
        throw redirect(308, '/chatrooms');
    }
    return {
        name: chat.chatname
    }
}