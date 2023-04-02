import type { GameState } from './../types/types';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const gameState: Writable<GameState | null> = writable(null); 