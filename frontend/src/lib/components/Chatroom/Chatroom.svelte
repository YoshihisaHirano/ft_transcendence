<script lang="ts">
	import type { Chat, Message } from "$lib/types/types";
	import ChatWindow from "./ChatWindow.svelte";

	export let userChats: Chat[];
	$: selectedChat = null as (Chat | null);
</script>

<div class="chat-container">
	<div class="chats-list simple-shadow">
		{#each userChats as chat}
			<input type="radio" name="group" id={chat.chatname} bind:group={selectedChat} value={chat} class="visually-hidden">
			<label for={chat.chatname}>
				{chat.chatname}
			</label>
		{/each}
	</div>
	<ChatWindow chat={selectedChat}/>
</div>

<style>
	.chat-container {
		display: flex;
	}

	.chats-list {
		flex: 0 0 25%;
		padding: 1rem 0.75rem;
	}

    :global(::-webkit-scrollbar) {
		display: none;
	}

	label {
		display: block;
		border-bottom: 1px solid white;
		cursor: pointer;
		padding-bottom: .35rem;
	}

	label ~ label {
		padding-top: .35rem;
	}

	input:checked + label {
		color: var(--color-accent-blue)
	}
</style>