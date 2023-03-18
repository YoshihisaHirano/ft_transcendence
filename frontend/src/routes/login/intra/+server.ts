/** @type {import('./$types').RequestHandler} */
import { VITE_BACKEND_URL, GET_TOKEN_URL, CLIENT_UID, CLIENT_SECRET, GET_LOGIN_URL } from '$env/static/private';
import { saveCookie } from '$lib/utils/storage';
import { redirect } from '@sveltejs/kit';

export async function GET({ url, cookies, fetch }) {
	const code = url.searchParams.get('code');
    let login = '';
    if (code) {
        try {
            const tokenRequestUrl = new URL(GET_TOKEN_URL);
            tokenRequestUrl.searchParams.append('grant_type', 'authorization_code');
            tokenRequestUrl.searchParams.append('code', code);
            tokenRequestUrl.searchParams.append('client_id', CLIENT_UID);
            tokenRequestUrl.searchParams.append('client_secret', CLIENT_SECRET);
            tokenRequestUrl.searchParams.append('redirect_uri', 'http://localhost:5176/login/intra');
            const res = await fetch(tokenRequestUrl, {
                method: 'POST'
            })
            const json = await res.json();
            const me = await fetch(GET_LOGIN_URL, {
                headers: {
                    Authorization: `Bearer ${json.access_token}`
                }
            });
            const meJson = await me.json();
            console.log(meJson.login);
            login = meJson.login;
            // cookies.set('user-token', json.access_token);
        } catch(err) {
            throw redirect(302, '/404');
        }
    }
    /// /user/login { login: login } 
    if (login) {
        const logMe = await fetch(new URL('/users/login', VITE_BACKEND_URL), {
            method: 'POST',
            body: JSON.stringify({ login })
        })
        console.log(logMe);
        cookies.set('user-token', 'aaaaa');
    }
    console.log(url);
    return new Response(null);
}