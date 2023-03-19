import { initialState } from '$lib/store/appState';
import type { AppState } from '$lib/types/types';
/** @type {import('./$types').PageLoad} */
import type { PageLoad } from './$types';
import { appState } from '$lib/store/appState';
import type { User } from '$lib/types/types';
import userService from '$lib/services/userService';
import { getFromStorage } from '$lib/utils/storage';

interface UserPageData {
	success: boolean;
	user: User | null;
}

export const load: PageLoad = async () => {
	let pageData: UserPageData = {
		success: false,
		user: null
	};
	if (!getFromStorage('userId')) return pageData;
	let currentState: AppState = initialState;
	/* if there's no user in store, then load it from backend by id */
	appState.subscribe((state) => {
		currentState = state;
	});
	if (currentState && currentState.user) {
		pageData = {
			success: true,
			user: currentState.user
		};
	} else {
		/* userId is stored in localStorage on login */
		const id = getFromStorage('userId');
		const user = await userService.getUserById(id as string);
		appState.update((prevState) => ({
			...prevState,
			user: user || null
		}));
		pageData = {
			success: !!user,
			user: currentState.user
		};
	}
	return pageData;
};
