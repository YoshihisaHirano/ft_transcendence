import gameService from "$lib/services/gameService";
import { appState, initialState } from "$lib/store/appState";
import { currentGameId, gameStatus, gameStats, isGameHost } from "$lib/store/gameState";
import type { AppState } from "$lib/types/types";

/** @type {import('./$types').PageLoad} */
export async function load() {
    const tournament = await gameService.getTournament();
    let currAppState: AppState = initialState;
    let gameId: string | null = null;

    appState.subscribe((val) => {
        currAppState = val;
    })

    currentGameId.subscribe((val) => {
        gameId = val;
    })
    

    if (currAppState.user && !gameId) {
        gameStatus.set('waiting');
        gameStats.set({
            userOneId: currAppState.user.id,
            userOneName: currAppState.user.username,
            userOneScore: 0,
            userTwoId: '',
            userTwoName: '',
            userTwoScore: 0
        })
        isGameHost.set(true);
        currentGameId.set(currAppState.user.id);
    }

    return {
        tournament
    }
}