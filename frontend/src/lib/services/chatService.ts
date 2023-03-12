import { newDMChat, newGroupChat } from '$lib/mockData/mockData';
import type { Chat, NewChat } from '$lib/types/types';

const endpoint = 'chats/';
const isMocking = true;

export default {
	createChat: async (newChat: NewChat): Promise<Chat | Error> => {
		try {
			if (newChat.privacyMode === 'protected' && !newChat.password) {
				throw new Error('Protected chats should have a password!');
			} else if (newChat.privacyMode != 'protected' && newChat.password) {
				delete newChat.password;
			}
			if (isMocking && !newChat.members) {
				return newGroupChat;
			}
			return newDMChat;
		} catch (error) {
			return error as Error;
		}
	},

	addMembers: async (members: string[]): Promise<void> => {
		return;
	}
};
