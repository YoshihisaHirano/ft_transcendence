import chatService from '$lib/services/chatService';
import { addAuthHeader, baseUrl, createBackendUrl, removeApiEndpoint } from '$lib/services/settings';
import { redirect } from '@sveltejs/kit';

export async function GET({ cookies, params }) {
    const id = params.slug;
    const userId = cookies.get('user-id') as string;
    const authToken = cookies.get('user-token');

    const endpoint = 'chat/';
    const baseUrlWithEndpoint = new URL(endpoint, baseUrl);
    const baseIdUrl = new URL('chatbyid/' + id, baseUrlWithEndpoint);
    const backendEndpoint = removeApiEndpoint(baseIdUrl.pathname);

    
    const response = await fetch(createBackendUrl(backendEndpoint), {
        headers: {
            ...addAuthHeader(authToken || '')
        }
    });
    const parsed = await response.text();
        const chat = JSON.parse(parsed);
        if (!chat || chat.banList.find((user) => user.id === id)) {
            throw redirect(303, '/404');
        }
        if (chat.privacyMode === 'protected') {
            throw redirect(308, '/chatrooms/invite/protected/' + id);
        } else {
            await chatService.addMembers([userId], id); //here potential problem with cookies
            throw redirect(308, '/chatrooms');
        }
    return new Response(null);
}