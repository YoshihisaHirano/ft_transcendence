<script lang="ts">
	import { appState } from '$lib/store/appState';
	import Button from '$lib/components/Button/Button.svelte';
	import chatService from '$lib/services/chatService';
	import type { ChatSettings, PrivacyMode, User } from '$lib/types/types';
	import PrivacySelect from '../PrivacySelect/PrivacySelect.svelte';
	import AddChatMembers from '../AddChatMembers/AddChatMembers.svelte';

	export let chatId: string,
		privacyMode: PrivacyMode,
		password: string | undefined,
		members: User[],
		adminId: string,
		chatname: string;

	$: friends = $appState.user?.friends || [];

	$: chatSettings = {
		chatId,
		adminId,
		privacyMode,
		password,
		chatname
	} as ChatSettings;

	let formRef: HTMLFormElement;

	$: areSettingsChanged =
		chatSettings.privacyMode != privacyMode ||
		chatSettings.password !== password ||
		chatSettings.adminId != adminId ||
		chatSettings.chatname != chatname;

	function updateChat(e: Event) {
		e.preventDefault();
		if (formRef && formRef.reportValidity()) {
			chatService.updateChat(chatSettings);
		}
	}
</script>

<form bind:this={formRef}>
	<fieldset>
		<legend> Chat settings </legend>
		<div class="settings-field">
			<label for="chatname">
				<p>chat name</p>
				<input id="chatname" type="text" required bind:value={chatSettings.chatname} />
			</label>
		</div>
		<div class="settings-field">
			<label for="admin">
				<p>chat admin</p>
				<select name="admin" id="admin" bind:value={chatSettings.adminId}>
					{#each members as { id, username }}
						<option value={id} selected={id === adminId}>{username}</option>
					{/each}
				</select>
			</label>
		</div>
		<div class="settings-field">
			<PrivacySelect bind:chatSettings />
		</div>
		<Button disabled={!areSettingsChanged} onClick={updateChat} variant="danger">Save</Button>
	</fieldset>
	{#if friends.length}
		<AddChatMembers {friends} {members} {chatId}/>
	{/if}
</form>

<style>
	fieldset {
		padding: 1.5rem 1rem;
	}

	.settings-field + .settings-field {
		margin-top: 1.75rem;
	}

	input {
		display: block;
	}

	fieldset:first-of-type {
		margin-bottom: 2rem;
	}

	label p {
		margin-bottom: 0.5rem;
	}

	select {
		appearance: none;
		padding: 0.35rem 0.25rem;
		min-width: 8rem;
		max-width: 10rem;
	}

	:global(.members-add-btn) {
		margin-right: 0;
	}
</style>
