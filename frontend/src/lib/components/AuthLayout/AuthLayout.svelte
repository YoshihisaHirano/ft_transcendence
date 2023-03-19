<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { getFromStorage } from '$lib/utils/storage';

	let loggedIn = getFromStorage('userId') !== null;
    onMount(() => {
        if (!loggedIn) {
            goto('/login');
        }
    }); 

</script>

{#if loggedIn}
    <slot/>
{:else}
    <div/>
{/if}