<script lang="ts">
	import { chatIo } from '$lib/sockets/websocketConnection';
	import type { ShortUser } from '$lib/types/types';
	import { getFromStorage } from '$lib/utils/storage';
	import OnlineIndicator from '../OnlineIndicator/OnlineIndicator.svelte';
	import UserRecord from '../UserProfile/UserRecord.svelte';

	export let showExtra: boolean, member: ShortUser, chatId: string, toggleDropdown: () => void;

	$: userId = getFromStorage('userId') || '';

	function removeFromChat(e: Event) {
		const target = e.target as HTMLButtonElement;
		const targetId = target.id.replace('remove-', '');
		chatIo.emit('kickUser', { userId: targetId, chatId });
        toggleDropdown();
	}

	function banUser(e: Event) {
		const target = e.target as HTMLButtonElement;
		const targetId = target.id.replace('ban-', '');
		chatIo.emit('banUser', { userId: targetId, chatId });
        toggleDropdown();
	}

	function muteUser(e: Event) {
		const target = e.target as HTMLButtonElement;
		const targetId = target.id.replace('mute-', '');
		chatIo.emit('muteUser', { userId: targetId, chatId });
        toggleDropdown();
	}
</script>

<div class="chat-member">
	<div>
		<OnlineIndicator isOnline={member.isOnline} />
		<UserRecord currentId={userId} username={member.username} userId={member.id} />
	</div>
	<div class="chat-member-controls">
		<button title="Invite to a game" id="invite-{member.id}" disabled={userId === member.id}
			>🏓</button
		>
		{#if showExtra}
			<button on:click={muteUser} title="Mute" id="mute-{member.id}" disabled={userId === member.id}
				>🔇</button
			>
			<button
				title="Kick from the chat"
				on:click={removeFromChat}
				disabled={userId === member.id}
				id="remove-{member.id}">❌</button
			>
			<button
				title="Ban from the chat"
				on:click={banUser}
				disabled={userId === member.id}
				id="ban-{member.id}">🚫</button
			>
		{/if}
	</div>
</div>

<style>
    button {
		background: transparent;
		cursor: pointer;
		margin: 0;
		outline: none;
		border: none;
		color: var(--text-primary);
	}

	button:disabled {
		filter: grayscale(0.7);
		opacity: 0.8;
		cursor: not-allowed;
	}

    .chat-member {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
	}

	.chat-member-controls {
		display: flex;
		gap: 8px;
	}

	.chat-member-controls button {
		padding: 0;
	}
</style>