<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte';
	import type { Chat } from '$lib/types/types';
	import MessageDisplay from './MessageDisplay.svelte';
	import ControlBar from './ControlBar.svelte';

	export let chat: Chat | null;
	$: messages = chat ? chat.messages : [];
	$: messageText = '';

	function sendMessage() {
		/* socket logic will be here */
		if (messageText) {
			messages = [...messages, { author: 'You', authorId: 'aaaa', text: messageText }];
			messageText = '';
		}
	}
</script>

<div class="chat-window simple-shadow">
	{#if chat}
		<ControlBar adminId={chat.adminId} chatMembers={chat.members} chatname={chat.chatname}  chatId={chat.chatId} />
	{/if}
	<MessageDisplay {messages} />
	<div class="input-area">
		<textarea bind:value={messageText} name="chat-message" id="chat-message" cols="45" rows="2" />
		<Button onClick={sendMessage} variant="success" className="chat-btn">Send</Button>
	</div>
</div>

<style>
	.chat-window {
		flex: 0 0 75%;
		height: 65vh;
		display: flex;
		flex-direction: column;
	}

	:global(.chat-btn) {
		margin-left: 6px;
		margin-right: 6px;
	}

	.input-area {
		display: flex;
		gap: 12px;
		padding: 0.5rem 1rem;
		align-items: center;
		flex-basis: 25%;
		flex-shrink: 0;
	}

	textarea {
		box-sizing: border-box;
		max-width: 85%;
	}
</style>
