import {
	addAuthHeader,
	addContentType,
	createBackendUrl,
	removeApiEndpoint
} from '$lib/services/settings';

/** @type {import('./$types').RequestHandler} */
export async function POST({ url, cookies, fetch, request }) {
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
		return new Response(JSON.stringify(json));
	} catch (error) {
		// console.error(error);
		return new Response(null);
	}
}
