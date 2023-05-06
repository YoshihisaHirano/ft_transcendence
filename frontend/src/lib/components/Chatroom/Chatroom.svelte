<script lang="ts">
	import ChatWindow from './ChatWindow.svelte';
	import privateIcon from '$lib/images/locked_icon.svg';
	import protectedIcon from '$lib/images/key_icon.svg';
	import frog from '$lib/images/frog_friend.svg';
	import Modal from '../Modal/Modal.svelte';
	import CreateChat from './CreateChat.svelte';
	import { chatState, selectedChatId } from '$lib/store/chatState';
	import { chatIo } from '$lib/sockets/chatSocket';
	import { onMount } from 'svelte';
	import { appState } from '$lib/store/appState';
	import { messagesState } from '$lib/store/messagesState';
	import { updateChats } from '$lib/utils/updates';

	$: userChats = $chatState;
	$: isModalOpen = false;

	onMount(() => {
		//(console.log)(userChats);
		const userId = $appState.user?.id;
		if (userId) {
			userChats.forEach((chat) => {
				chatIo.emit('joinChat', { userId, chatId: chat.chatId });
			});
		}
		chatIo.on('joinChatStatus', (messages) => {
			messagesState.update((val) => ({
				...val,
				[messages.chatId]: [...messages.messages]
			}));
		});

		return () => chatIo.off('joinChatStatus');
	});

	function toggleModal() {
		isModalOpen = !isModalOpen;
	}
</script>

<div class="chat-container">
	<div class="chats-list simple-shadow">
		<div class="chat-list-controls">
			<p>
				{userChats.length} chats
				<img src={frog} alt="" width="24px" height="24px" />
			</p>
			<button on:click={toggleModal}>+</button>
		</div>
		{#each userChats as chat}
			<input
				type="radio"
				name="group"
				id={chat.chatId}
				bind:group={$selectedChatId}
				value={chat.chatId}
				class="visually-hidden"
			/>
			<label for={chat.chatId}>
				{chat.chatname}
				{#if chat.privacyMode != 'public'}
					{@const isPrivate = chat.privacyMode == 'private'}
					{@const tip = isPrivate ? 'chat is private' : 'chat is protected'}
					<img src={isPrivate ? privateIcon : protectedIcon} alt={tip} title={tip} />
				{/if}
			</label>
		{/each}
	</div>
	<ChatWindow />
</div>

{#if isModalOpen}
	<Modal title="create new chat" onClose={toggleModal}>
		<CreateChat {toggleModal} />
	</Modal>
{/if}

<style>
	.chat-container {
		display: flex;
	}

	.chats-list {
		flex: 0 0 25%;
		padding: 1rem 0.85rem;
	}

	:global(::-webkit-scrollbar) {
		display: none;
	}

	label {
		display: flex;
		border-bottom: 1px solid white;
		cursor: pointer;
		padding-bottom: 0.35rem;
		justify-content: space-between;
	}

	label ~ label {
		padding-top: 0.35rem;
	}

	input:checked + label {
		color: var(--color-accent-blue);
	}

	.chat-list-controls {
		display: flex;
		border: 1px solid #fff;
		justify-content: space-between;
		align-items: center;
		text-align: center;
		width: calc(100% + 1.7rem);
		position: relative;
		left: -0.85rem;
		top: -1rem;
	}

	.chat-list-controls button {
		background: var(--text-primary);
		padding: 4px 8px;
		margin: 0;
		border: 0;
		cursor: pointer;
	}

	.chat-list-controls p {
		margin-left: 12px;
	}

	.chat-list-controls img {
		display: inline;
		vertical-align: bottom;
	}
</style>
