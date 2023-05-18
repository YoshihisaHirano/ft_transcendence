/** @type {import('./$types').LayoutServerLoad} */
import userService from '$lib/services/userService';
import { statusIo } from '$lib/sockets/statusSocket';
import { appState, initialState } from '$lib/store/appState';
import { gameMode } from '$lib/store/gameState';
import type { AppState } from '$lib/types/types';
import { getFromStorage } from '$lib/utils/storage';

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
	if (user) {
		gameMode.set(user.gameMode);
	}
	appState.update(() => ({
		user: user || null
	}));
	
	if (user) {
		statusIo.emit('userConnect', user.id);
		// // console.log('connect event emmited');
	}
}
