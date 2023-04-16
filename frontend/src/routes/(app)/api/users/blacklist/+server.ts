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
	const backendEnpoint = 'users/blacklist';
	const authToken = cookies.get('user-token');
	const method = bodyJson.method;
	try {
		const res = await fetch(createBackendUrl(backendEnpoint), {
			method: method,
			headers: {
				...addAuthHeader(authToken || ''),
				...addContentType()
			},
			body: JSON.stringify({ userId: bodyJson.userId, blackId: bodyJson.blackId })
		});
		console.log(res, JSON.stringify({ userId: bodyJson.userId, blackId: bodyJson.blackId }));
	} catch (err) {
		if (err instanceof Error && err.message === unauthorizedCode) {
			throw error(401, unauthorizedCode);
		}
	}
	return new Response(null);
}
