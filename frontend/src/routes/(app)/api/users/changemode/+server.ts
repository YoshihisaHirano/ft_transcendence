/** @type {import('./$types').RequestHandler} */
import { addAuthHeader, addContentType, createBackendUrl, removeApiEndpoint, unauthorizedCode } from "$lib/services/settings";
import { error } from "@sveltejs/kit";

export async function GET({ request, fetch, cookies, url }) {
    const mode = url.searchParams.get('mode');
    const id = url.searchParams.get('id');
    url.searchParams.delete('mode');
    url.searchParams.delete('id');
    if (mode && id) {
        const backendEndpoint = removeApiEndpoint(url.pathname);
        const authToken = cookies.get('user-token');
        const reqBody = { userId: id, mode };
        try {
            const res = await fetch(createBackendUrl(backendEndpoint), {
                method: 'PUT',
                headers: {
                    ...addAuthHeader(authToken || ''),
                    ...addContentType()
                },
                body: JSON.stringify(reqBody)
            })
        } catch (err) {
            if (err instanceof Error && err.message === unauthorizedCode) {
                throw error(401, unauthorizedCode);
            }
        }
    }
    return new Response(null);
}