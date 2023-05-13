import { newGroupChat } from '$lib/mockData/mockData';
import type { Chat, ChatSettings, NewChat } from '$lib/types/types';
import { addContentType, baseUrl } from './settings';

const endpoint = 'chat/';
const baseUrlWithEndpoint = new URL(endpoint, baseUrl);
const isMocking = false;

export default {
	createChat: async (newChat: NewChat): Promise<Chat | Error> => {
		try {
			if (newChat.privacyMode === 'protected' && !newChat.password) {
				throw new Error('Protected chats should have a password!');
			} else if (newChat.privacyMode != 'protected') {
				newChat.password = null;
			}
			if (isMocking) {
				return newGroupChat;
			}
			const res = await fetch(new URL('create', baseUrlWithEndpoint), {
				headers: {
					...addContentType()
				},
				method: 'POST',
				body: JSON.stringify(newChat)
			});
			return res.json();
		} catch (error) {
			return error as Error;
		}
	},

	addMembers: async (usersId: string[], chatId: string): Promise<boolean> => {
		try {
			await fetch(new URL('addmembers', baseUrlWithEndpoint), {
				headers: {
					...addContentType()
				},
				method: 'PUT',
				body: JSON.stringify({ usersId, chatId })
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},

	removeMember: async (memberId: string, chatId: string): Promise<void> => {
		return;
	},

	updateChat: async (settings: ChatSettings, privacyModeChanged: boolean): Promise<Chat | Error> => {
		try {
			if (privacyModeChanged && settings.privacyMode === 'protected' && !settings.password) {
				throw new Error('Protected chats should have a password!');
			} else if (settings.privacyMode != 'protected') {
				settings.password = null;
			}
			if (isMocking) {
				return newGroupChat;
			}
			const res = await fetch(new URL('settings', baseUrlWithEndpoint), {
				headers: {
					...addContentType()
				},
				method: 'PUT',
				body: JSON.stringify(settings)
			});
			return res.json();
		} catch (error) {
			return error as Error;
		}
	},

	checkChatPassword: async (password: string, chatId: string): Promise<boolean> => {
		try {
			const res = await fetch(new URL('checkpassword', baseUrlWithEndpoint), {
				headers: {
					...addContentType()
				},
				method: 'POST',
				body: JSON.stringify({ chatId, password })
			});
			return res.json();
		} catch (error) {
			console.error(error);
			return false;
		}
	},

	getChatById: async (chatId: string): Promise<Chat | null> => {
		const baseIdUrl = new URL('chatbyid/', baseUrlWithEndpoint);
		try {
			const res = await fetch(new URL(chatId, baseIdUrl));
			const parsed = await res.text();
			if (!parsed.length) {
				return null;
			} else {
				return JSON.parse(parsed);
			}
		} catch (error) {
			console.error(error);
			return null;
		}
	},

	deleteChat: async (chatId: string): Promise<void> => {
		const baseRouteUrl = new URL('deletechat/', baseUrlWithEndpoint);
		try {
			await fetch(new URL(chatId, baseRouteUrl), {
				method: 'DELETE'
			});
		} catch (error) {
			console.error(error);
		}
	},

	getChatsByUserId: async (userId: string): Promise<Chat[]> => {
		const baseIdUrl = new URL('userid/', baseUrlWithEndpoint);
		try {
			const res = await fetch(new URL(userId, baseIdUrl));
			return res.json();
		} catch (error) {
			console.error(error);
			return [];
		}
	},

	findDirectChat: async (userOneId: string, userTwoId: string): Promise<Chat | null> => {
		try {
			const res = await fetch(new URL('direct', baseUrlWithEndpoint), {
				headers: {
					...addContentType()
				},
				method: 'POST',
				body: JSON.stringify({ userOneId, userTwoId })
			});
			const parsed = await res.text();
			if (!parsed.length) {
				return null;
			} else {
				return JSON.parse(parsed);
			}
		} catch (error) {
			console.error(error);
			return null;
		}
	}
};
