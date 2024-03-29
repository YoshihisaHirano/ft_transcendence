/** @type {import('./$types').RequestHandler} */
import {
	addAuthHeader,
	addContentType,
	createBackendUrl,
	removeApiEndpoint,
	unauthorizedCode
} from '$lib/services/settings';
import { error } from '@sveltejs/kit';

export async function POST({ url, request, fetch, cookies }) {
	const backendEnpoint = removeApiEndpoint(url.pathname);
	const bodyJson = await request.json();
	const authToken = cookies.get('user-token');
	try {
		const res = await fetch(createBackendUrl(backendEnpoint), {
			method: 'POST',
			headers: {
				...addAuthHeader(authToken || ''),
				...addContentType()
			},
			body: JSON.stringify(bodyJson)
		});
		const json = await res.json();
		if (json.id) {
			cookies.set('user-id', json.id, {
				path: '/', secure: false
			});
		}
		return new Response(JSON.stringify(json));
	} catch (err) {
		if (err instanceof Error && err.message === unauthorizedCode) {
			throw error(401, unauthorizedCode);
		}
		if (err instanceof Error) {
            throw error(400, err.message);
        }
		return new Response(JSON.stringify({ success: false }));
	}
}
