<script lang="ts">
	import type { PrivacyMode, User } from '$lib/types/types';
	import CogIcon from '$lib/components/CogIcon/CogIcon.svelte';
	import { getFromStorage } from '$lib/utils/storage';
	import UserRecord from '$lib/components/UserProfile/UserRecord.svelte';
	import OnlineIndicator from '$lib/components/OnlineIndicator/OnlineIndicator.svelte';
	import Modal from '$lib/components/Modal/Modal.svelte';
	import doorIcon from '$lib/images/door_icon.svg';
	import ChatSettings from './ChatSettings.svelte';

	export let adminId: string,
		chatMembers: User[],
		chatname: string,
		chatId: string,
		privacyMode: PrivacyMode,
		password: string | undefined;

	$: userId = getFromStorage('userId') || '';
	$: isAdmin = userId === adminId;
	let btnRef: HTMLButtonElement;
	$: offsetLeft = btnRef?.offsetLeft || 0;

	$: dropdownActive = false;
	$: modalOpen = false;

	function toggleDropdown() {
		dropdownActive = !dropdownActive;
	}

	function toggleModal() {
		modalOpen = !modalOpen;
	}
</script>

{#if chatId}
	<div class="chat-control-bar">
		<div class="chat-header">
			<p>{chatname}</p>
			<button
				title="{dropdownActive ? 'Hide' : 'Show'} participants"
				class="dropdown-btn"
				class:active={dropdownActive}
				bind:this={btnRef}
				on:click={toggleDropdown}>▼</button
			>
			<button title="Leave the chat" class="leave-btn">
				<img src={doorIcon} alt="leave the chat" />
			</button>
			<div class="members-dropdown" style="left: {offsetLeft}px">
				{#each chatMembers as member}
					<div class="chat-member">
						<div>
							<OnlineIndicator isOnline={member.isOnline} />
							<UserRecord currentId={userId} username={member.username} userId={member.id} />
						</div>
						<div class="chat-member-controls">
							<button title="Invite to a game">🏓</button>
							{#if isAdmin}
								<button title="Mute">🔇</button>
								<button title="Delete from the chat">❌</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
		{#if isAdmin}
			<button class="chat-settings-btn" on:click={toggleModal}>
				<CogIcon />
			</button>
		{/if}
	</div>
{/if}

{#if modalOpen}
	<Modal title="{chatname} settings" onClose={toggleModal}>
		<ChatSettings {chatname} {chatId} {privacyMode} {password} {adminId} members={chatMembers} />
	</Modal>
{/if}

<style>
	button {
		background: transparent;
		cursor: pointer;
		margin: 0;
		outline: none;
		border: none;
	}

	.members-dropdown {
		padding: 0.5rem;
		border: 1px solid white;
		position: absolute;
		top: 3.25rem;
		font-size: 0.85rem;
		transform: translateX(-87%);
		text-align: start;
		z-index: 1;
		background-color: var(--background-primary);
		max-height: 150px;
		overflow-y: auto;
		display: none;
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

	.dropdown-btn {
		color: var(--text-primary);
		border: 0.5px solid white;
		border-radius: 50%;
		font-size: 0.85rem;
	}

	.dropdown-btn.active {
		transform: rotateX(180deg);
	}

	.dropdown-btn.active ~ .members-dropdown {
		display: block;
	}

	.chat-control-bar {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem;
		position: relative;
	}

	.chat-header {
		flex-basis: 95%;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}

	.chat-settings-btn {
		justify-self: flex-end;
	}

	.leave-btn {
		padding: 0;
	}
</style>
