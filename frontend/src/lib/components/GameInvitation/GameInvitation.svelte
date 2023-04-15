<script lang="ts">
	import { statusIo } from '$lib/sockets/statusSocket';
	import Button from '../Button/Button.svelte';
	import JumpingDots from '../JumpingDots/JumpingDots.svelte';
	import Modal from '../Modal/Modal.svelte';
	import type { GameInvite } from '$lib/types/types';
	import { appState } from '$lib/store/appState';

	export let disabled = false,
		playerId: string,
		playerName: string,
		className = '';

	$: isInviteModalOpen = false;
	$: inviteData = {
		playerId,
		gameId: $appState.user?.id || ''
	} as GameInvite;
	$: inviteFailedMsg = '';

	function sendGameInvitation() {
		isInviteModalOpen = true;
		statusIo.emit('inviteUser', inviteData);
	}

	function cancelInvitation() {
		isInviteModalOpen = false;
		statusIo.emit('cancelInvite', inviteData);
	}

	statusIo.on('inviteFail', (msg: string) => {
		inviteFailedMsg = msg;
		setTimeout(() => {
			inviteFailedMsg = '';
			isInviteModalOpen = false;
		}, 1000);
	})

	statusIo.on('inviteRejected', () => {
		inviteFailedMsg = `${playerName} rejected your invite!`;
		setTimeout(() => {
			inviteFailedMsg = '';
			isInviteModalOpen = false;
		}, 1000);
	})
</script>

<button
	on:click={sendGameInvitation}
	class={className}
	title="Invite to a game"
	id="invite-{playerId}"
	{disabled}
>
	🏓
</button>

{#if isInviteModalOpen}
	<Modal title="Game invitation for {playerName}" onClose={cancelInvitation}>
		{#if inviteFailedMsg}
			<p class="invitation-text">{inviteFailedMsg}</p>
		{:else}
		<p class="invitation-text">
			Waiting for their respond
			<JumpingDots />
		</p>
		<Button variant="danger" onClick={cancelInvitation}>Cancel invitation</Button>
		{/if}
	</Modal>
{/if}

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

	.invitation-text {
		margin: 3rem auto;
	}
</style>
