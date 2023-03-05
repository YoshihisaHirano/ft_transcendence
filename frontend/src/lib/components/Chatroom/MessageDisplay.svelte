<script lang="ts">
	import type { Message } from '$lib/types/types';
	import ChatMessage from './ChatMessage.svelte';
	import { afterUpdate, beforeUpdate } from 'svelte';

	export let messages: Message[];
	let windowDiv: HTMLDivElement, autoscroll: boolean;

	beforeUpdate(() => {
		autoscroll =
			windowDiv && windowDiv.offsetHeight + windowDiv.scrollTop > windowDiv.scrollHeight - 20;
	});

	afterUpdate(() => {
		if (autoscroll) windowDiv.scrollTo(0, windowDiv.scrollHeight);
	});
</script>

<div class="messages-container simple-shadow" bind:this={windowDiv}>
	{#if messages.length}
		{#each messages as message}
			<ChatMessage {message} />
		{/each}
	{:else}
		<p>nothing to display...</p>
	{/if}
</div>

<style>
	.messages-container {
		width: 100%;
		max-width: 100%;
		padding: 1rem 0.75rem;
		flex-basis: 75%;
		flex-grow: 0;
		overflow-y: auto;
	}
</style>
