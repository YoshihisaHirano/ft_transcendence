import { createBackendUrl, addAuthHeader, addContentType } from '$lib/services/settings';
import type { Chat } from '$lib/types/types';
import { redirect } from '@sveltejs/kit';

export async function GET({ cookies, params, fetch }) {
	const id = params.slug;
	const userId = cookies.get('user-id') as string;
    // console.log('HERE');
	const authToken = cookies.get('user-token');
	const getChatEndpoint = `chat/chatbyid/${id}/`;
	const addMemberEndpoint = 'chat/addmembers';
	const chatRaw = await fetch(createBackendUrl(getChatEndpoint), {
		headers: {
			...addAuthHeader(authToken || '')
		}
	});
	const chat: Chat | Error = await chatRaw.json();
	// console.log(chat);
	// console.log(userId);
	if ('message' in chat) {
		throw redirect(303, '/404');
	}
	if (!chat || chat.banList.find((user) => user.id === userId)) {
		throw redirect(303, '/404');
	}
	if (chat.privacyMode === 'protected') {
		throw redirect(308, '/chatrooms/invite/protected/' + id);
	} else {
		if (chat.members.findIndex((member) => member.id === userId) == -1) {
			const resRaw = await fetch(createBackendUrl(addMemberEndpoint), {
				method: 'PUT',
				headers: {
					...addAuthHeader(authToken || ''),
					...addContentType()
				},
				body: JSON.stringify({ usersId: [userId], chatId: id })
			});
			const res: Chat | Error = await resRaw.json();
			if ('message' in res) {
				throw redirect(303, '/404');
			}
		}
		throw redirect(308, '/chatrooms');
	}

	return new Response(null);
}
