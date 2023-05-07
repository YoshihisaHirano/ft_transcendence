<script lang="ts">
	import { appState } from '$lib/store/appState';
	import Button from '$lib/components/Button/Button.svelte';
	import chatService from '$lib/services/chatService';
	import type { ChatSettings, PrivacyMode, ShortUser } from '$lib/types/types';
	import PrivacySelect from '../PrivacySelect/PrivacySelect.svelte';
	import AddChatMembers from '../AddChatMembers/AddChatMembers.svelte';
	import { chatState } from '$lib/store/chatState';
	import { chatIo } from '$lib/sockets/chatSocket';
	import UserRecord from '../UserProfile/UserRecord.svelte';
	import userService from '$lib/services/userService';
	import { updateChats } from '$lib/utils/updates';

	export let chatId: string,
		privacyMode: PrivacyMode,
		password: string | undefined,
		members: ShortUser[],
		adminId: string,
		chatname: string,
		banList: ShortUser[];

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

	async function updateChat(e: Event) {
		e.preventDefault();
		if (formRef && formRef.reportValidity()) {
			const updatedChat = await chatService.updateChat(chatSettings);
			if (!('message' in updatedChat)) {
				chatState.update((val) => {
					const updatedChatIdx = val.findIndex((item) => item.chatId === chatId);
					const updatedChats = val.slice();
					updatedChats[updatedChatIdx] = updatedChat;
					return [...updatedChats];
				});
				chatIo.emit('updateChat', updatedChat.chatId);
				updateChats(adminId);
			}
		}
	}

	async function unbanUser(e: Event) {
		const target = e.target as HTMLButtonElement;
		const userId = target.dataset.user;
		// console.log(userId);
		if (userId) {
			await userService.unbanUser(chatId, userId);
			updateChats(adminId);
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
		<AddChatMembers {friends} {members} {chatId} />
	{/if}
</form>
{#if banList.length}
<div class="ban-list">
	<p>Banned: {banList.length}</p>
	<div>
		{#each banList as user}
		<div class="banned-user">
			<UserRecord currentId={adminId} userId={user.id} username={user.username} />
			<button data-user={user.id} on:click={unbanUser} title="unban">✖</button>
		</div>
		{/each}
	</div>
</div>
{/if}

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

	.ban-list {
		margin-top: 1rem;
	}

	.ban-list > div {
		padding: 1rem 0;
		display: flex;
	}

	.banned-user {
		border-bottom: 1px dashed white;
	}

	button {
		background: transparent;
		cursor: pointer;
		margin: 0;
		padding: 0;
		outline: none;
		border: none;
		color: var(--text-primary);
	}
</style>
