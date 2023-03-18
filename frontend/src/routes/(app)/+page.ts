import { initialState } from '$lib/store/appState';
import type { AppState } from '$lib/types/types';
/** @type {import('./$types').PageLoad} */
import { userDb } from '$lib/mockData/mockData';
import type { PageLoad } from './$types';
import { appState } from '$lib/store/appState';
import { getCookie } from '$lib/utils/storage';
import type { User } from '$lib/types/types';
import userService from '$lib/services/userService';

interface UserPageData {
	success: boolean;
	user: User | null;
}

export const load: PageLoad = async () => {
	let pageData: { data: UserPageData } = {
		data: {
			success: false,
			user: null
		}
	};
	if (!getCookie('user-id')) return pageData;
	let currentState: AppState = initialState;
	/* if there's no user in store, then load it from backend by id */
	appState.subscribe((state) => {
		currentState = state;
	});
	if (currentState && currentState.user) {
		pageData = {
			data: {
				success: true,
				user: currentState.user
			}
		};
	} else {
		/* userId is stored in localStorage on login */
		const id = getCookie('user-id');
		const user = await userService.getUserById(id as string);
		appState.update((prevState) => ({
			...prevState,
			user: user || null
		}));
		pageData = {
			data: {
				success: !!user,
				user: currentState.user
			}
		};
	}
    // await userService.toggleFriendship('75cd86e0-695f-428a-8b4b-10ba68d69a27', '76dc60dd-f95b-47ee-803a-e6c8643d8933', "POST");
	// await userService.toggleFriendship('75cd86e0-695f-428a-8b4b-10ba68d69a27', '4388e1f5-5268-4cb1-a4ea-9f2555251f45', "POST");
	return pageData;
};
