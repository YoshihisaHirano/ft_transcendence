import { mainUser } from '$lib/mockData/mockData';
import type { NewUser, User } from '$lib/types/types';
import { removeFromStorage } from '$lib/utils/storage';
import { addContentType, baseUrl, unauthorizedCode } from './settings';

const endpoint = 'users/';
const baseUrlWithEndpoint = new URL(endpoint, baseUrl);
const isMocking = false;

export default {
	async getUserById (userId: string): Promise<User | null> {
		const baseIdUrl = new URL('id/', baseUrlWithEndpoint);
		if (isMocking) {
			return mainUser;
		} else {
			try {
				const res = await fetch(new URL(userId, baseIdUrl));
				if (res.status === 401) {
					await this.logout();
					return null;
				}
				return res.json();
			} catch (err) {
				return null;
			}
		}
	},

	async createUser (newUser: NewUser): Promise<User | Error> {
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
				if (res.status === 401) {
					await this.logout();
					return new Error('Unauthorized!');
				}
				return res.json();
			} catch (error) {
				if ((error as Error).message === unauthorizedCode) {
					this.logout();
				}
				return error as Error;
			}
		}
	},

	async toggleFriendship (
		userId: string,
		friendId: string,
		add: boolean
	): Promise<void> {
		if (isMocking) {
			return;
		} else {
			const methodEndpoint = add ? 'addfriend' : 'deletefriend';
			try {
				const res = await fetch(new URL('friendship', baseUrlWithEndpoint), {
					headers: {
						...addContentType()
					},
					method: "POST",
					body: JSON.stringify({ userId, friendId, methodEndpoint })
				});
				
				if (res.status === 401) {
					await this.logout();
					return;
				}
			} catch (err) {
				return;
			}
		}
	},

	async toggleBlacklist (
		userId: string,
		blackId: string,
		add: boolean
	): Promise<void> {
		const method = add ? 'PUT' : 'DELETE';
		try {
			const res = await fetch(new URL('blacklist', baseUrlWithEndpoint), {
				headers: {
					...addContentType()
				},
				method: 'POST',
				body: JSON.stringify({ userId, blackId, method })
			});
			
			if (res.status === 401) {
				await this.logout();
				return;
			}
		} catch (err) {
			return;
		}
	},

	async savePreferredMode(mode: string, userId: string): Promise<void> {
		try {
			const url = new URL('changemode', baseUrlWithEndpoint);
			url.searchParams.append('mode', mode);
			url.searchParams.append('id', userId);
			const res = await fetch(url);
		} catch (error) {
			return;
		}
	},

	async unbanUser(chatId: string, userId: string): Promise<void> {
		try {
			const res = await fetch(new URL('unban', baseUrlWithEndpoint), {
				headers: {
					...addContentType()
				},
				method: 'POST',
				body: JSON.stringify({ chatId, userId })
			});
			
			if (res.status === 401) {
				await this.logout();
				return;
			}
		} catch (err) {
			return;
		}
	},

	async logout (): Promise<void> {
		try {
			await fetch(new URL('logout/', baseUrlWithEndpoint), {
				method: 'DELETE'
			});
			removeFromStorage('userId');
		} catch (error) {
			console.error(error);
		}
	}
};
