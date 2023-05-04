import {
	addAuthHeader,
	addContentType,
	createBackendUrl,
	unauthorizedCode
} from '$lib/services/settings';
import { error } from '@sveltejs/kit';
/** @type {import('./$types').RequestHandler} */

export async function POST({ request, fetch, cookies }) {
	const bodyJson = await request.json();
	const backendEnpoint = '2fa/generate';
	const authToken = cookies.get('user-token');
	try {
		const res = await fetch(createBackendUrl(backendEnpoint), {
			method: 'POST',
			headers: {
				...addAuthHeader(authToken || ''),
				...addContentType()
			},
			body: JSON.stringify({ login: bodyJson.login })
		});
	} catch (err) {
		if (err instanceof Error && err.message === unauthorizedCode) {
			throw error(401, unauthorizedCode);
		}
	}
	return new Response(null);
}
