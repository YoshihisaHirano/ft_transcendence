import { addAuthHeader, addContentType, createBackendUrl } from '$lib/services/settings';
import { redirect } from '@sveltejs/kit';
/** @type {import('./$types').RequestHandler} */

export async function POST({ request, fetch, cookies }) {
	const bodyJson = await request.json();
	const backendEnpoint = 'users/' + bodyJson.methodEndpoint;
	const authToken = cookies.get('user-token');
	if (!authToken) {
		throw redirect(303, '/login');
	} else {
		try {
			await fetch(createBackendUrl(backendEnpoint), {
				method: 'POST',
				headers: {
					...addAuthHeader(authToken),
					...addContentType()
				},
				body: JSON.stringify({ userId: bodyJson.userId, friendId: bodyJson.friendId })
			});
		} catch (error) {
            console.error(error);
        }
	}
	return new Response(null);
}
