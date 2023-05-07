import gameService from "$lib/services/gameService";
import { appState, initialState } from "$lib/store/appState";
import { currentGameId, gameStatus, gameStats, isGameHost } from "$lib/store/gameState";
import { tournamentState } from "$lib/store/tournamentState";
import type { AppState, GameStatus } from "$lib/types/types";

/** @type {import('./$types').PageLoad} */
export async function load() {
    const tournament = await gameService.getTournament();
    tournamentState.set(tournament || []);
}