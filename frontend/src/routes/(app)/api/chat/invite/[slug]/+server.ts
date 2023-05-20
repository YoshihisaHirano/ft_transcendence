import { createBackendUrl, addAuthHeader, addContentType } from '$lib/services/settings';
import type { Chat } from '$lib/types/types';
import { redirect } from '@sveltejs/kit';

export async function GET({ cookies, params, fetch, setHeaders }) {
	setHeaders({ 'cache-control': 'max-age=0' });
	const id = params.slug;
	const userId = cookies.get('user-id') as string;
	// console.log('HERE', userId);
	const authToken = cookies.get('user-token');
	const getChatEndpoint = `chat/chatbyid/${id}/`;
	const addMemberEndpoint = 'chat/addmembers';
	let chat: Chat | Error | null = null;
	try {
		const chatRaw = await fetch(createBackendUrl(getChatEndpoint), {
			headers: {
				...addAuthHeader(authToken || '')
			}
		});
		chat = await chatRaw.json();
		// // console.log(chat);
	} catch (error) {
		// console.error(error);
		chat = null;
	}
	if (chat && 'privacyMode' in chat && chat.privacyMode === 'private') {
		throw redirect(303, '/404');
	}
	if (chat && 'message' in chat) {
		throw redirect(303, '/404');
	}
	if (!chat || chat.banList?.find((user) => user.id === userId)) {
		throw redirect(303, '/404');
	}
	if (chat && chat.privacyMode === 'protected') {
		throw redirect(308, '/chatrooms/invite/protected/' + id);
	} else {
		if (chat && chat.members && chat.members.findIndex((member) => member.id === userId) == -1) {
			const resRaw = await fetch(createBackendUrl(addMemberEndpoint), {
				method: 'PUT',
				headers: {
					...addAuthHeader(authToken || ''),
					...addContentType()
				},
				body: JSON.stringify({ usersId: [userId], chatId: id })
			});
			let res: Chat | Error | null = null;
			try {
				res = await resRaw.json();
			} catch (error) {
				// console.error(error);
				res = error as Error;
			}
			if (res && 'message' in res) {
				throw redirect(303, '/404');
			}
		}
		throw redirect(308, '/chatrooms');
	}

	return new Response(JSON.stringify({ success: true }));
}
