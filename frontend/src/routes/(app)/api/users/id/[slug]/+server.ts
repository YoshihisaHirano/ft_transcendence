import { addAuthHeader, createBackendUrl, removeApiEndpoint } from '$lib/services/settings';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies, fetch }) {
	const backendEndpoint = removeApiEndpoint(url.pathname);
	const authToken = cookies.get('user-token');
	if (!authToken) {
		throw redirect(303, '/login');
	} else {
		try {
			const user = await fetch(createBackendUrl(backendEndpoint), {
				headers: {
					...addAuthHeader(authToken)
				}
			});
			const userJSON = await user.json();
			return new Response(JSON.stringify(userJSON));
		} catch (error) {
			console.error(error);
			return new Response(null);
		}
	}
}
