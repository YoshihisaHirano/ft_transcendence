import { mainUser } from '$lib/mockData/mockData';
import type { NewUser, User } from '$lib/types/types';
import { addContentType, baseUrl } from './settings';

const endpoint = 'users/';
const baseUrlWithEndpoint = new URL(endpoint, baseUrl);
const isMocking = false;

export default {
	getUserById: async (userId: string): Promise<User | null> => {
		const baseIdUrl = new URL('id/', baseUrlWithEndpoint);
		if (isMocking) {
			return mainUser;
		} else {
			try {
				const res = await fetch(new URL(userId, baseIdUrl));
				return res.json();
			} catch (err) {
				console.error(err);
				return null;
			}
		}
	},

	createUser: async (newUser: NewUser): Promise<User | Error> => {
		if (isMocking) {
			return mainUser;
		} else {
			try {
				const res = await fetch(new URL('create', baseUrlWithEndpoint), {
					headers: {
						...addContentType()
					},
					method: 'POST',
					body: JSON.stringify(newUser)
				});
				return res.json();
			} catch (error) {
				return error as Error;
			}
		}
	},

	toggleFriendship: async (
		userId: string,
		friendId: string,
		add: boolean
	): Promise<void> => {
		if (isMocking) {
			return;
		} else {
			const methodEndpoint = add ? 'addfriend' : 'deletefriend';
			try {
				await fetch(new URL('friendship', baseUrlWithEndpoint), {
					headers: {
						...addContentType()
					},
					method: "POST",
					body: JSON.stringify({ userId, friendId, methodEndpoint })
				});
			} catch (err) {
				// TODO: error handling!
				return;
			}
		}
	},

	logout: async (): Promise<void> => {
		try {
			await fetch(new URL('logout/', baseUrlWithEndpoint), {
				method: 'DELETE'
			});
		} catch (error) {
			console.error(error);
		}
	}
};
