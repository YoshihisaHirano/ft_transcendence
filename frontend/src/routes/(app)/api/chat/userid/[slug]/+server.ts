import { addAuthHeader, createBackendUrl, removeApiEndpoint } from "$lib/services/settings";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies, fetch }) {
    const backendEndpoint = removeApiEndpoint(url.pathname);
	const authToken = cookies.get('user-token');
    try {
        const chats = await fetch(createBackendUrl(backendEndpoint), {
            headers: {
                ...addAuthHeader(authToken || '')
            }
        });
        const chatsJSON = await chats.json();
		return new Response(JSON.stringify(chatsJSON));
    } catch (error) {
        console.error(error);
		return new Response(JSON.stringify(null));
    }
}