/** @type {import('./$types').RequestHandler} */
import {
	VITE_BACKEND_URL,
	GET_TOKEN_URL,
	CLIENT_UID,
	CLIENT_SECRET,
	GET_LOGIN_URL
} from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import { addContentType } from '$lib/services/settings';

export async function GET({ url, cookies, fetch }) {
	const code = url.searchParams.get('code');
	let login = '';
    let userExists = false;
	//console.log(code);
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
			});
			const json = await res.json();
			// console.log(json);
			const me = await fetch(GET_LOGIN_URL, {
				headers: {
					Authorization: `Bearer ${json.access_token}`
				}
			});
			const meJson = await me.json();
			//console.log(meJson.login);
			login = meJson.login;
		} catch (err) {
			throw redirect(302, '/404');
		}
	}
	// for testing stuff
	// login = 'momo';
	if (login) {
		// try {
			const logMe = await fetch(new URL('/2fa/login', VITE_BACKEND_URL), {
				method: 'POST',
				body: JSON.stringify({ login }),
				headers: {
					...addContentType()
				}
			});
			// console.log(JSON.stringify({ login }), 'login')
            const logMeJSON = await logMe.json();
			console.log(login, logMeJSON);
			// console.log(cookies.get('user-token'))
			const now = new Date();
			cookies.set('user-login', login, {
				path: '/', secure: false,
				expires: new Date(now.getTime() + 10*60000)
			})
			if (logMeJSON.auth === '2fa') {
				throw redirect(302, `/login/2fa/${login}`);
			}
			cookies.set('user-token', logMeJSON.token, {
                path: '/', secure: false
            });
            if (logMeJSON.id) {
                cookies.set('user-id', logMeJSON.id, {
                    path: '/', secure: false
                });
                userExists = true;
            }
		// }
		// catch (error) {
		// 	console.error(error);
        //     throw redirect(302, '/404');
		// }
	}
	if (userExists) {
        throw redirect(308, '/');
    } else {
        throw redirect(308, '/login');
    }
	return new Response(null);
}
