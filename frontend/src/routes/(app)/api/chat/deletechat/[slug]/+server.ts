import {
	addAuthHeader,
	createBackendUrl,
	removeApiEndpoint
} from '$lib/services/settings';

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ url, cookies, fetch }) {
	const backendEnpoint = removeApiEndpoint(url.pathname);
	const authToken = cookies.get('user-token');
	try {
		const res = await fetch(createBackendUrl(backendEnpoint), {
			method: 'DELETE',
			headers: {
				...addAuthHeader(authToken || ''),
			}
		});
		const json = await res.json();
		return new Response(JSON.stringify(json));
	} catch (error) {
		// console.error(error);
		return new Response(null);
	}
}
