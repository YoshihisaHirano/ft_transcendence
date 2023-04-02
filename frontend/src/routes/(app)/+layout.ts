/** @type {import('./$types').LayoutServerLoad} */
import { goto } from '$app/navigation';
import userService from '$lib/services/userService';
import { appState, initialState } from '$lib/store/appState';
import type { AppState } from '$lib/types/types';
import { getFromStorage, removeFromStorage } from '$lib/utils/storage';

export async function load() {
	if (!getFromStorage('userId')) return;
	let currentState: AppState = initialState;
	appState.subscribe((state) => {
		currentState = state;
	});
	if (currentState && currentState.user) {
		return;
	}
	const id = getFromStorage('userId');
	const user = await userService.getUserById(id as string);
	if (!user) {
		removeFromStorage('userId');
		goto('/login');
	}
	appState.update((prevState) => ({
		...prevState,
		user: user || null
	}));
}
