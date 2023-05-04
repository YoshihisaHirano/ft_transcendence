import { addContentType, baseUrl } from './settings';
import userService from './userService';

const endpoint = 'auth/';
const baseUrlWithEndpoint = new URL(endpoint, baseUrl);

export default {
    async toggleSwitch2Fa (
		code: string,
		login: string,
	): Promise<void> {
		try {
			const res = await fetch(new URL('switch', baseUrlWithEndpoint), {
				headers: {
					...addContentType()
				},
				method: 'POST',
				body: JSON.stringify({ code, login })
			});
			if (res.status === 401) {
				await userService.logout();
				return;
			}
		} catch (err) {
			return;
		}
	},
    async generateQRcode (login: string): Promise<void> {
        try {
			const res = await fetch(new URL('generate', baseUrlWithEndpoint), {
				headers: {
					...addContentType()
				},
				method: 'POST',
				body: JSON.stringify({ login })
			});
			if (res.status === 401) {
				await userService.logout();
				return;
			}
		} catch (err) {
			return;
		}
    },
    async verifyCode (
		code: string,
		login: string,
	): Promise<void> {
		try {
			const res = await fetch(new URL('verify', baseUrlWithEndpoint), {
				headers: {
					...addContentType()
				},
				method: 'POST',
				body: JSON.stringify({ code, login })
			});
			if (res.status === 401) {
				await userService.logout();
				return;
			}
		} catch (err) {
			return;
		}
	},
}
