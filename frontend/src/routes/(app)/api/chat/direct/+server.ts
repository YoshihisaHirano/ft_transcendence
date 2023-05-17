import { addAuthHeader, createBackendUrl, removeApiEndpoint } from "$lib/services/settings";

/** @type {import('./$types').RequestHandler} */
export async function POST({ url, cookies, fetch, request }) {
	const backendEndpoint = removeApiEndpoint(url.pathname);
	const bodyJson = await request.json();
	const authToken = cookies.get('user-token');
    const idSlug = `${backendEndpoint}/${bodyJson.userOneId}/${bodyJson.userTwoId}`;
    let res;
    try {
        res = await fetch(createBackendUrl(idSlug), {
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
        // console.error(error, 'here');
		return new Response(JSON.stringify(null));
    }
    return new Response(null);
}