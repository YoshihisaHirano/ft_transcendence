<script lang="ts">
	import ChatMessage from './ChatMessage.svelte';
	import { afterUpdate, beforeUpdate, onMount } from 'svelte';
	import { messagesState } from '$lib/store/messagesState';
	import { selectedChatId } from '$lib/store/chatState';
	import { chatIo } from '$lib/sockets/chatSocket';
	import { appState } from '$lib/store/appState';

	export let isBlocked = false;
	$: messages = ($selectedChatId ? $messagesState[$selectedChatId] : []) || [];
	let windowDiv: HTMLDivElement, autoscroll: boolean;
	$: popupMsg = isBlocked ? 'You cannot send messages to this chat' : '';
	$: blacklist = $appState.user?.blacklist || [];

	beforeUpdate(() => {
		autoscroll =
			windowDiv && windowDiv.offsetHeight + windowDiv.scrollTop > windowDiv.scrollHeight - 20;
	});

	onMount(() => {
		chatIo.on('stillInMute', (data) => {
			// console.log(data, 'stillInMute');
			if (data.chatId === $selectedChatId) {
				popupMsg = `You are temporarily not allowed to send messages to ${data.chatname}`;
				setTimeout(() => {
					popupMsg = '';
				}, 20000);
			}
		});

		return () => {
			chatIo.off('stillInMute');
		}
	});

	afterUpdate(() => {
		if (autoscroll) windowDiv.scrollTo(0, windowDiv.scrollHeight);
	});
</script>

<div class="messages-container simple-shadow" bind:this={windowDiv}>
	{#if messages.length}
		{#each messages as message}
		{@const blockMsg = blacklist.includes(message.authorId)}
		{#if !blockMsg}
			<ChatMessage {message} />
		{/if}
		{/each}
	{:else}
		<p>nothing to display...</p>
	{/if}
	{#if popupMsg}
		<div class="popup"><p>{popupMsg}</p></div>
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

	.popup {
		width: 100%;
		background-color: var(--background-primary);
		color: var(--text-primary);
		padding: 0.5rem 1rem;
		color: red;
		position: absolute;
		top: 0;
		left: 0;
		text-align: center;
		border: 1px solid white;
	}
</style>
