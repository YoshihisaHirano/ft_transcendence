import type { GameData } from '$lib/types/types';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const availableGames: Writable<GameData[]> = writable([]);
export const gameBeingShown: Writable<GameData | null> = writable(null);