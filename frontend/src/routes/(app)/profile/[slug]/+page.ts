/** @type {import('./$types').PageLoad} */
import { userDb } from '$lib/mockData/mockData';
import userService from '$lib/services/userService';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	/* here will be the call to backend, smth like .getUserDataById() */
	const id = params.slug;
	const user = await userService.getUserById(id);
	return {
		data: {
			success: !!user,
			user: user
		}
	};
};
