/** @type {import('./$types').PageLoad} */
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { REDIRECT_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ cookies }) => {
	const userToken = cookies.get('user-token');
	const userId = cookies.get('user-id');
	const login = cookies.get('user-login');
	if (!userToken) {
		return {
			userId: null,
			login: null,
			redirectUrl: REDIRECT_URL
		}
	}
	if (!userId) {
		return {
			userId: null,
			login
		}
	} else {
		// cookies.set('user-login', '', {
		// 	expires: new Date(0)
		// })
		return {
			userId,
			login
		}
	}
};
