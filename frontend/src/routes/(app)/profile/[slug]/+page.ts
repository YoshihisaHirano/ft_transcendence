/** @type {import('./$types').PageLoad} */
import userService from '$lib/services/userService';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const id = params.slug;
	const user = await userService.getUserById(id);
	// console.log('profile page loaded');
	return {
		success: !!user,
		user: user
	};
};
