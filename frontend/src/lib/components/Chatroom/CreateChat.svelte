<script lang="ts">
	import type { NewChat } from '$lib/types/types';
	import PrivacySelect from '$lib/components/PrivacySelect/PrivacySelect.svelte';
	import AddChatMembers from '../AddChatMembers/AddChatMembers.svelte';
	import { appState } from '$lib/store/appState';
	import Button from '../Button/Button.svelte';
	import chatService from '$lib/services/chatService';

	$: newChat = {
		chatname: '',
		members: [],
		privacyMode: 'public',
		password: ''
	} as NewChat;

	$: friends = $appState.user?.friends || [];
	$: id = $appState.user?.id || '';
	let formRef: HTMLFormElement;

	function createChat(e: Event) {
		e.preventDefault();
		if (formRef && formRef.reportValidity()) {
			newChat.members = [...newChat.members, id];
            chatService.createChat(newChat);
		}
	}
</script>

<form bind:this={formRef}>
	<fieldset>
		<legend>{newChat.chatname || 'new chat'}</legend>
		<div class="settings-field">
			<label for="chatname">
				<p>chat name</p>
				<input id="chatname" type="text" required bind:value={newChat.chatname} />
			</label>
		</div>
        <div class="settings-field">
            <AddChatMembers {friends} bind:newMembers={newChat.members} newChat />
        </div>
		<div class="settings-field">
			<PrivacySelect bind:chatSettings={newChat} />
		</div>
	</fieldset>
	<Button className="new-chat-btn" variant="success" onClick={createChat}>Create!</Button>
</form>

<style>
	fieldset {
		padding: 1.2rem 1rem;
	}

	label p {
		margin-bottom: 0.5rem;
	}

	.settings-field + .settings-field {
		margin-top: 1.75rem;
	}

	:global(.new-chat-btn) {
		margin-right: 0;
		margin-top: 2rem;
	}
</style>
