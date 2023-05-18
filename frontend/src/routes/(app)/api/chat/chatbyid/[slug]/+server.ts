import { addAuthHeader, createBackendUrl, removeApiEndpoint } from "$lib/services/settings";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies, fetch }) {
    const backendEndpoint = removeApiEndpoint(url.pathname);
	const authToken = cookies.get('user-token');
    try {
        const res = await fetch(createBackendUrl(backendEndpoint), {
            headers: {
                ...addAuthHeader(authToken || '')
            }
        });
        const parsed = await res.text();
        if (!parsed.length) {
            return new Response(JSON.stringify(null));
        } else {
            return new Response(parsed);
        }
    } catch (error) {
        // console.error(error);
		return new Response(JSON.stringify(null));
    }
}