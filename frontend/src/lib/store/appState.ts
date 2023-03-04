import type { AppState } from './../types/types';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { getFromStorage } from '$lib/utils/storage';

export const appState: Writable<AppState> = writable({
	isLoggedIn: getFromStorage('isLoggedIn') ? true : false
});
