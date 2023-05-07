import { addAuthHeader, createBackendUrl, removeApiEndpoint, unauthorizedCode } from '$lib/services/settings';
import { redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies, fetch }) {
	const backendEndpoint = removeApiEndpoint(url.pathname);
	const authToken = cookies.get('user-token');
		try {
			const user = await fetch(createBackendUrl(backendEndpoint), {
				headers: {
					...addAuthHeader(authToken || '')
				}
			});
			if (user.status === 401) {
				throw new Error('401');
			}
			if (user.status === 500) {
				throw new Error('500');
			}
			const userJSON = await user.json();
			
			return new Response(JSON.stringify(userJSON));
		} catch (err) {
			if (err instanceof Error && err.message === unauthorizedCode) {
				throw error(401, unauthorizedCode);
			}
			return new Response(JSON.stringify(null));
		}
	}
