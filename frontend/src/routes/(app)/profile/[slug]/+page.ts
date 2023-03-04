/** @type {import('./$types').PageLoad} */
import { userDb } from '$lib/mockData/mockData';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	/* here will be the call to backend, smth like .getUserDataById() */
	const id = params.slug;
	const user = userDb.find((item) => item.id === id);
	return {
		data: {
			success: !!user,
			user: user
		}
	};
};
