import { addAuthHeader, addContentType, createBackendUrl, removeApiEndpoint, unauthorizedCode } from "$lib/services/settings";
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function PUT({ url, cookies, fetch, request }) {
    const backendEnpoint = removeApiEndpoint(url.pathname);
	const bodyJson = await request.json();
	const authToken = cookies.get('user-token');
    try {
        const res = await fetch(createBackendUrl(backendEnpoint), {
            method: 'PUT',
			headers: {
				...addAuthHeader(authToken || ''),
				...addContentType()
			},
			body: JSON.stringify(bodyJson)
        })
        const resJson = await res.json();
        if (resJson && resJson.statusCode >= 400) {
            throw error(404, 'Not found');
        }
        return new Response(JSON.stringify({ success: true }));
    } catch (err: any) {
        if (err instanceof Error && err.message === unauthorizedCode) {
			throw error(401, unauthorizedCode);
		}
        if ('status' in err) {
            throw error(err.status, err.body.message);
        }
        if (err instanceof Error) {
            throw error(400, err.message);
        }
        return new Response(JSON.stringify({ success: false })); 
    }
}