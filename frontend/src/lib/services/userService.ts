import { mainUser } from '$lib/mockData/mockData';
import type { NewUser, User } from '$lib/types/types';
import { baseUrl } from './settings';

const endpoint = 'users/';
const baseUrlWithEndpoint = new URL(endpoint, baseUrl);
const isMocking = false;

export default {
	getUserById: async (userId: string): Promise<User | null> => {
		if (isMocking) {
			return mainUser;
		} else {
			try {
				const res = await fetch(new URL(userId, baseUrlWithEndpoint));
				return res.json();
			} catch (err) {
				console.error(err);
				return null;
			}
		}
	},

	getUserByLogin: async (intraLogin: string): Promise<User | null> => {
		/* I send the intra login to the backend
		so that it checks whether the user has already been created */
		return null;
	},

	getIntraLogin: async (): Promise<string | null> => {
		/* the login happens with 42 Oauth  */
		return Math.random() > 0.2 ? 'aalannys' : null;
	},

	createUser: async (newUser: NewUser): Promise<User | Error> => {
		if (isMocking) {
			return mainUser;
		} else {
			try {
				const res = await fetch(new URL('create', baseUrlWithEndpoint), {
					headers: {
						['Content-Type']: 'application/json'
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
				await fetch(new URL(methodEndpoint, baseUrlWithEndpoint), {
					headers: {
						['Content-Type']: 'application/json'
					},
					method: "POST",
					body: JSON.stringify({ userId, friendId })
				});
			} catch (err) {
				// TODO: error handling!
				return;
			}
		}
	}
};
