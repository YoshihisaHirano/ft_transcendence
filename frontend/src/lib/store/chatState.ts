import type { Chat } from '$lib/types/types';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const chatState: Writable<Chat[]> = writable([]);
export const selectedChatId: Writable<string | null> = writable(null);
