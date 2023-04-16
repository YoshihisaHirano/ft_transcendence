import type { GameStatus, GameStats, GameMode } from './../types/types';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const gameStats: Writable<GameStats | null> = writable(null);
export const isGameHost: Writable<boolean> = writable(false);
export const currentGameId: Writable<string | null> = writable(null);
export const gameStatus: Writable<GameStatus | null> = writable(null);
export const gameMode: Writable<GameMode> = writable('default');