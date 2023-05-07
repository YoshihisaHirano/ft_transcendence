<script lang="ts">
	import type { PrivacyMode, ShortUser } from '$lib/types/types';
	import CogIcon from '$lib/components/CogIcon/CogIcon.svelte';
	import { getFromStorage } from '$lib/utils/storage';
	import Modal from '$lib/components/Modal/Modal.svelte';
	import doorIcon from '$lib/images/door_icon.svg';
	import ChatSettings from './ChatSettings.svelte';
	import linkIcon from '$lib/images/link_icon.svg';
	import chatService from '$lib/services/chatService';
	import { chatState, selectedChatId } from '$lib/store/chatState';
	import { chatIo } from '$lib/sockets/chatSocket';
	import MembersControl from './MembersControl.svelte';

	export let adminId: string,
		chatMembers: ShortUser[],
		chatname: string,
		chatId: string,
		privacyMode: PrivacyMode,
		password: string | undefined,
		isDirect: boolean,
		banList: ShortUser[];

	$: userId = getFromStorage('userId') || '';
	$: isAdmin = userId === adminId;
	let btnRef: HTMLButtonElement;
	$: offsetLeft = btnRef?.offsetLeft || 0;

	$: dropdownActive = false;
	$: modalOpen = false;
	$: copySuccessText = '';

	function toggleDropdown() {
		dropdownActive = !dropdownActive;
	}

	function toggleModal() {
		modalOpen = !modalOpen;
	}

	function copyLink() {
		const base = import.meta.env.VITE_FRONTEND_URL;
		const link = base + 'chat/invite/' + chatId;
		// navigator.clipboard.writeText(link);
		const textArea = document.createElement('textarea');
		textArea.value = link;
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		try {
			document.execCommand('copy');
		} catch (err) {
			console.error('Unable to copy to clipboard', err);
		}
		document.body.removeChild(textArea);
		copySuccessText = 'Copied to clipboard';
		setTimeout(() => {
			copySuccessText = '';
		}, 1000);
	}

	function leaveChat() {
		chatIo.emit('leaveChat', { userId, chatId });
		selectedChatId.set(null);
	}

	function deleteChat() {
		chatService.deleteChat(chatId);
		selectedChatId.set(null);
		const updatedChats = $chatState.filter((item) => item.chatId !== chatId);
		chatState.update(() => [...updatedChats]);
	}
</script>

{#if chatId}
	<div class="chat-control-bar">
		<div class="chat-header">
			<div class="copy-success" class:visible={copySuccessText}>{copySuccessText}</div>
			{#if privacyMode !== 'private'}
				<button title="share chat link" class="share-btn" on:click={copyLink}>
					<img src={linkIcon} alt="share chat link" />
				</button>
			{/if}
			<p>{chatname}</p>
			<button
				title="{dropdownActive ? 'Hide' : 'Show'} participants"
				class="dropdown-btn"
				class:active={dropdownActive}
				bind:this={btnRef}
				on:click={toggleDropdown}>▼</button
			>
			{#if !isDirect}
				<button title="Leave the chat" class="leave-btn" on:click={leaveChat}>
					<img src={doorIcon} alt="leave the chat" />
				</button>
			{/if}
			<div class="members-dropdown" style="left: {offsetLeft}px">
				{#each chatMembers as member}
					<MembersControl {toggleDropdown} {chatId} showExtra={isAdmin && !isDirect} {member} />
				{/each}
			</div>
		</div>
		{#if isAdmin && !isDirect}
			<button class="chat-settings-btn" on:click={toggleModal}>
				<CogIcon />
			</button>
			<button title="Delete the chat" on:click={deleteChat}>X</button>
		{/if}
	</div>
{/if}

{#if modalOpen}
	<Modal title="{chatname} settings" onClose={toggleModal}>
		<ChatSettings
			{banList}
			{chatname}
			{chatId}
			{privacyMode}
			{password}
			{adminId}
			members={chatMembers}
		/>
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

	.copy-success {
		position: absolute;
		font-family: monospace;
		font-size: 0.8rem;
		left: 0;
		bottom: -1.75rem;
		background-color: var(--text-primary);
		color: var(--background-primary);
		padding: 0.25rem;
		transition: opacity 0.2s ease-in;
		opacity: 0;
	}

	.copy-success.visible {
		opacity: 1;
	}

	.share-btn {
		position: absolute;
		left: 0.5rem;
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
