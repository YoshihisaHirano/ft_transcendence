import type { AppState } from './../types/types';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { getFromStorage } from '$lib/utils/storage';

export const initialState = {
	user: null,
}

export const appState: Writable<AppState> = writable({...initialState});
