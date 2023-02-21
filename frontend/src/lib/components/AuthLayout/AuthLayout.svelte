<script lang="ts">
	import { appState } from '$lib/store/appState';
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';

	let loggedIn = false;
    let unsubscribe: Unsubscriber | null = null;
    onMount(() => {
        unsubscribe = appState.subscribe((state) => {
        loggedIn = state.isLoggedIn;
        if (!loggedIn) {
            goto('/login');
        }
    });
    }) 

    if (unsubscribe) {
        onDestroy(unsubscribe);
    }
</script>

{#if loggedIn}
    <slot/>
{:else}
    <div/>
{/if}