/** @type {import('./$types').PageLoad} */
import userService from '$lib/services/userService.js';
import { appState } from '$lib/store/appState';
import { getFromStorage } from '$lib/utils/storage.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params }) {
	let slug = params.slug;
	// console.log('2fa slug' ,slug)
	const userId = getFromStorage('userId');
	let alreadyLogged = false;
	let logout = false;
	if (userId) {
		try {
			const user =  await userService.getUserById(userId);
			if (user && user.login === slug) {
				alreadyLogged = true;
			} else if (user && user.login !== slug) {
				alreadyLogged = true;
			} else {
				await userService.logout();
				logout = true;
			}
		} catch (error) {
			// console.error(error);
		}
	}
	if (logout) {
		throw redirect(302, '/login');
	}
	if (alreadyLogged) {
		throw redirect(302, '/');
	}
	appState.subscribe((val) => {
		if (val.user?.login && val.user.login !== slug) {
			throw redirect(302, '/');
		}
	})
	return { slug };
}
