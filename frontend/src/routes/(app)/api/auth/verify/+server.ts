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
	const backendEnpoint = '2fa/authenticate';
	const authToken = cookies.get('user-token');
	try {
		const res = await fetch(createBackendUrl(backendEnpoint), {
			method: 'POST',
			headers: {
				...addAuthHeader(authToken || ''),
				...addContentType()
			},
			body: JSON.stringify({ code: bodyJson.code, login: bodyJson.login })
		});
		const resJson = await res.json();
		cookies.set('user-token', resJson.token, {
			path: '/', secure: false
		});
		return new Response(JSON.stringify(resJson));
	} catch (err) {
		if (err instanceof Error && err.message === unauthorizedCode) {
			throw error(401, unauthorizedCode);
		}
		throw error(401, 'Wrong authentication code');
		return new Response(JSON.stringify({ success: false }));
	}
	return new Response(JSON.stringify({ success: true }));
}
