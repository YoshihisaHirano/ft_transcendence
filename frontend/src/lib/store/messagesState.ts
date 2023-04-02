import type { MessagesState } from '$lib/types/types';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const messagesState: Writable<MessagesState> = writable({});