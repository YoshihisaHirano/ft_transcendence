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
		admins: ShortUser[],
		ownerId: string,
		chatname: string,
		banList: ShortUser[];

	$: friends = $appState.user?.friends || [];

	$: chatSettings = {
		chatId,
		adminIds: admins.map((item) => item.id),
		privacyMode,
		password,
		chatname
	} as ChatSettings;

	let formRef: HTMLFormElement;

	$: areSettingsChanged =
		chatSettings.privacyMode != privacyMode ||
		chatSettings.password !== password ||
		chatSettings.chatname != chatname;

	async function chatUpdater() {
		const updatedChat = await chatService.updateChat(chatSettings);
			if (!('message' in updatedChat)) {
				// chatState.update((val) => {
				// 	const updatedChatIdx = val.findIndex((item) => item.chatId === chatId);
				// 	const updatedChats = val.slice();
				// 	updatedChats[updatedChatIdx] = updatedChat;
				// 	return [...updatedChats];
				// });
				chatIo.emit('updateChat', updatedChat.chatId);
			}
	}

	async function updateChat(e: Event) {
		e.preventDefault();
		if (formRef && formRef.reportValidity()) {
			await chatUpdater();
		}
	}

	async function unbanUser(e: Event) {
		const target = e.target as HTMLButtonElement;
		const userId = target.dataset.user;
		// console.log(userId);
		if (userId) {
			await userService.unbanUser(chatId, userId);
			updateChats(ownerId);
		}
	}

	async function addChatAdmin(e: Event) {
		const target = e.target as HTMLButtonElement;
		const id = target.dataset.id;
		if (id) {
			const newAdmins = [...chatSettings.adminIds, id];
			chatSettings = { ...chatSettings, adminIds: newAdmins };
			await chatUpdater();
			updateChats(ownerId);
		}
	}

	async function removeChatAdmin(e: Event) {
		const target = e.target as HTMLButtonElement;
		const id = target.dataset.id;
		if (id) {
			const newAdmins = chatSettings.adminIds.filter((item) => item !== id);
			chatSettings = { ...chatSettings, adminIds: newAdmins };
			await chatUpdater();
			updateChats(ownerId);
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
					<UserRecord currentId={ownerId} userId={user.id} username={user.username} /><button
						data-user={user.id}
						on:click={unbanUser}
						title="unban">✖</button
					>
				</div>
			{/each}
		</div>
	</div>
{/if}
{#if members.length - 1}
	<fieldset>
		<legend>Admins: {admins.length}</legend>
		{#if admins.length}
			<p class="admins-label">Here are your chat admins:</p>
			<div class="admins-wrapper">
				{#each admins as admin}
					<p>
						<UserRecord currentId={ownerId} userId={admin.id} username={admin.username} />
						{#if admin.id !== ownerId}
							<button title="exclude from admins" on:click={removeChatAdmin} data-id={admin.id} class="remove-admin-btn">✖</button>
						{/if}
					</p>
				{/each}
			</div>
		{/if}
		<p class="admins-label">You can set these users as chat admins:</p>
		<div class="admins-wrapper">
			{#each members as potentialAdmin}
			{#if !chatSettings.adminIds.includes(potentialAdmin.id)}
				<p>
					<UserRecord
						currentId={ownerId}
						userId={potentialAdmin.id}
						username={potentialAdmin.username}
					/>
					<button title="add to admins" on:click={addChatAdmin} data-id={potentialAdmin.id} class="add-admin-btn"
						>+</button
					>
				</p>
				{/if}
			{/each}
		</div>
	</fieldset>
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

	.add-admin-btn {
		color: #2cb01a;
	}

	.remove-admin-btn {
		color: #e52521;
	}

	.admins-wrapper {
		display: flex;
		gap: 0.85rem;
		flex-wrap: wrap;
	}

	.admins-wrapper + p {
		margin-top: 1.5rem;
	}

	.admins-wrapper p {
		border-bottom: 1px white dashed;
	}

	.admins-label {
		margin-bottom: 1rem;
	}

	:global(.members-add-btn) {
		margin-right: 0;
	}

	.ban-list {
		/* margin-top: 1rem; */
		display: flex;
		gap: 0.75rem;
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
