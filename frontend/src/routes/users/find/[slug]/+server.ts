import { addAuthHeader, createBackendUrl, removeApiEndpoint } from '$lib/services/settings';
import type { User } from '$lib/types/types';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies, fetch }) {
	const backendEndpoint = removeApiEndpoint(url.pathname);
	const authToken = cookies.get('user-token');
	let userJson: { user: User } | Error | null = null;
	try {
		const res = await fetch(createBackendUrl(backendEndpoint.replace('find', 'username')), {
			headers: {
				...addAuthHeader(authToken || '')
			}
		});
		userJson = await res.json();
	} catch (error) {
		// console.error(error);
		userJson = null;
	}
	if (userJson && !('message' in userJson) && userJson.user) {
		throw redirect(302, `/profile/${userJson.user}`);
	} else {
		throw redirect(302, '/404');
	}
	return new Response(JSON.stringify({ success: true }));
}
