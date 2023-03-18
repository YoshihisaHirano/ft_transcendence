/** @type {import('./$types').PageLoad} */
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { REDIRECT_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ cookies, url, fetch, params }) => {
	console.log(cookies.get('user-token'));
	if (cookies.get('user-token') === undefined) {
		throw redirect(302, REDIRECT_URL);
	}
	return;
};
