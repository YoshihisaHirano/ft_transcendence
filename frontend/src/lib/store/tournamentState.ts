import type { Tournament } from '$lib/types/types';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const tournamentState: Writable<Tournament[]> = writable([]);