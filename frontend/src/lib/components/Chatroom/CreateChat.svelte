<script lang="ts">
	import type { NewChat } from '$lib/types/types';
	import PrivacySelect from '$lib/components/PrivacySelect/PrivacySelect.svelte';
	import AddChatMembers from '../AddChatMembers/AddChatMembers.svelte';
	import { appState } from '$lib/store/appState';
	import Button from '../Button/Button.svelte';
	import chatService from '$lib/services/chatService';
	import { chatState } from '$lib/store/chatState';
	import { chatIo } from '$lib/sockets/chatSocket';

	export let toggleModal: () => void;

	$: friends = $appState.user?.friends || [];
	$: id = $appState.user?.id || '';

	$: newChat = {
		chatname: '',
		members: [],
		privacyMode: 'public',
		password: '',
		adminId: id,
		isDirect: false
	} as NewChat;

	let formRef: HTMLFormElement;
	$: errorMsg = '';

	$: createDisabled = (newChat.privacyMode === 'protected' && !newChat.password) || !newChat.chatname;

	async function createChat(e: Event) {
		e.preventDefault();
		if (formRef && formRef.reportValidity()) {
			newChat.members = [...newChat.members, id];
            const resChat = await chatService.createChat(newChat);
			if ('message' in resChat) {
				errorMsg = resChat.message;
			} else {
				chatState.update((val) => ([...val, resChat]));
				errorMsg = '';
				toggleModal();
				chatIo.emit('updateChat', resChat.chatId);
			}
		}
	}
</script>

<form bind:this={formRef}>
	<fieldset>
		<legend>{newChat.chatname || errorMsg || 'new chat'}</legend>
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
	<Button disabled={createDisabled} className="new-chat-btn" variant="success" onClick={createChat}>Create!</Button>
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
