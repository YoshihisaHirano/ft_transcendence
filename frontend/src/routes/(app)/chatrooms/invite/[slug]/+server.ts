import chatService from '$lib/services/chatService';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, params }) {
    const id = params.slug;
    const userId = cookies.get('user-id') as string;
    
    const chat = await chatService.getChatById(id);
    //(console.log)(chat, id);
    if (!chat) {
        throw redirect(303, '/404');
    }
    if (chat.privacyMode === 'protected') {
        throw redirect(308, 'protected/' + id);
    } else {
        await chatService.addMembers([userId], id);
        throw redirect(308, '/chatrooms');
    }

    return new Response(null);
}