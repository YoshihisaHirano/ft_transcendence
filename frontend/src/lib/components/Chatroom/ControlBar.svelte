<script lang="ts">
	import type { User } from '$lib/types/types';
	import CogIcon from '$lib/components/CogIcon/CogIcon.svelte';
	import { getFromStorage } from '$lib/utils/storage';
	import UserRecord from '$lib/components/UserProfile/UserRecord.svelte';
	import OnlineIndicator from '$lib/components/OnlineIndicator/OnlineIndicator.svelte';

	export let adminId: string, chatMembers: User[], chatname: string, chatId: string;
	$: userId = getFromStorage('userId') || '';
	$: isAdmin = userId === adminId;
	let btnRef: HTMLButtonElement;
	$: offsetLeft = btnRef?.offsetLeft || 0;
	$: dropdownActive = false;

	function toggleDropdown() {
		dropdownActive = !dropdownActive;
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
            <button title="Leave the chat">
                <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 20 20" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.6666 8L17.75 10.5L15.6666 8Z" stroke="#FFF" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.6666 13L17.75 10.5L15.6666 13Z" stroke="#FFF" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16.5 10.5L10 10.5" stroke="#FFF" stroke-width="1" stroke-linecap="round"/>
                    <line x1="4" y1="3.5" x2="13" y2="3.5" stroke="#FFF" stroke-width="1" stroke-linecap="round"/>
                    <line x1="4" y1="17.5" x2="13" y2="17.5" stroke="#FFF" stroke-width="1" stroke-linecap="round"/>
                    <path d="M13 3.5V7.5" stroke="#FFF" stroke-width="1" stroke-linecap="round"/>
                    <path d="M13 13.5V17.5" stroke="#FFF" stroke-width="1" stroke-linecap="round"/>
                    <path d="M4 3.5L4 17.5" stroke="#FFF" stroke-width="1" stroke-linecap="round"/>
                </svg>
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
			<button class="chat-settings-btn">
				<CogIcon />
			</button>
		{/if}
	</div>
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
</style>
