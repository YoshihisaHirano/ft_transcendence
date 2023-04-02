import { addAuthHeader, createBackendUrl, removeApiEndpoint } from '$lib/services/settings';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies, fetch }) {
    const backendEndpoint = removeApiEndpoint(url.pathname);
	const authToken = cookies.get('user-token');
    try {
        const tornament =  await fetch(createBackendUrl(backendEndpoint), {
            headers: {
                ...addAuthHeader(authToken || '')
            }
        });
        const tournamentJSON = await tornament.json();
        return new Response(JSON.stringify(tournamentJSON));
    } catch (error) {
        console.error(error);
        return new Response(null);
    }
}