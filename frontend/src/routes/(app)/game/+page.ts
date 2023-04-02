import gameService from "$lib/services/gameService";
import { appState, initialState } from "$lib/store/appState";
import { gameState } from "$lib/store/gameState";
import type { AppState, GameState } from "$lib/types/types";

/** @type {import('./$types').PageLoad} */
export async function load() {
    const tournament = await gameService.getTournament();
    let currAppState: AppState = initialState;

    appState.subscribe((val) => {
        currAppState = val;
    })

    let newGame: GameState | null = null;

    if (currAppState.user) {
        newGame = {
            status: 'waiting',
            stats: {
                userOneId: currAppState.user.id,
                userOneName: currAppState.user.username,
                userOneScore: 0,
                userTwoId: '',
                userTwoName: '',
                userTwoScore: 0
            }
        }

        gameState.set(newGame)
    }

    return {
        tournament
    }
}