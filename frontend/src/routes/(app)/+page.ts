import { initialState } from '$lib/store/appState';
import type { AppState } from '$lib/types/types';
/** @type {import('./$types').PageLoad} */
import { userDb } from '$lib/mockData/mockData';
import type { PageLoad } from './$types';
import { appState } from '$lib/store/appState';
import { getFromStorage } from '$lib/utils/storage';
import type { User } from '$lib/types/types';

interface UserPageData {
	success: boolean;
	user: User | null;
}

export const load: PageLoad = () => {
	let pageData: { data: UserPageData } = {
		data: {
			success: false,
			user: null
		}
	};
	if (!getFromStorage('userId')) return pageData;
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
        /* userId is stored in cookies on login */
        const id = getFromStorage('userId');
        const user = userDb.find((item) => item.id === id);
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
	return pageData;
};
