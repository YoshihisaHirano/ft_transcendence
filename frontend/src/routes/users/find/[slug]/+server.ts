import {
	addAuthHeader,
	createBackendUrl,
	removeApiEndpoint,
} from '$lib/services/settings';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies, fetch }) {
	const backendEndpoint = removeApiEndpoint(url.pathname);
	const authToken = cookies.get('user-token');
		const res = await fetch(createBackendUrl(backendEndpoint.replace('find', 'username')), {
			headers: {
				...addAuthHeader(authToken || '')
			}
		});
		 const userJson = await res.json();
         if (userJson.user) {
            throw redirect(302, `/profile/${userJson.user}`);
         } else {
            throw redirect(302, '/404');
         }
		return new Response(null);
}
