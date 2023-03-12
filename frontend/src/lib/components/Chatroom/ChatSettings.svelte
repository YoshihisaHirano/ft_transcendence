<script lang="ts">
	import { appState } from '$lib/store/appState';
	import Button from '$lib/components/Button/Button.svelte';
	import chatService from '$lib/services/chatService';
	import type { ChatSettings, PrivacyMode, User } from '$lib/types/types';
	import PrivacySelect from '../PrivacySelect/PrivacySelect.svelte';
	export let chatId: string,
		privacyMode: PrivacyMode,
		password: string | undefined,
		members: User[],
		adminId: string,
		chatname: string;

	$: friends = $appState.user?.friends || [];
	$: newMembers = [] as string[];
	$: chatSettings = {
		chatId,
		adminId,
		privacyMode,
		password,
		chatname
	} as ChatSettings;

	$: areSettingsChanged =
		chatSettings.privacyMode != privacyMode ||
		chatSettings.password !== password ||
		chatSettings.adminId != adminId ||
		chatSettings.chatname != chatname;

	function addMembers() {
		if (newMembers.length) {
			chatService.addMembers(newMembers);
		}
	}
</script>

<div class="">
	<fieldset>
		<legend> Chat settings </legend>
		<div class="settings-field">
			<label for="chatname">
				chat name
				<input id="chatname" type="text" bind:value={chatSettings.chatname} />
			</label>
		</div>
		<div class="settings-field">
			<PrivacySelect bind:chatSettings />
		</div>
		<Button disabled={!areSettingsChanged} onClick={() => console.log('hi')} variant="danger"
			>Save</Button
		>
	</fieldset>
	{#if friends.length}
		<fieldset class="members">
			<legend> Add members </legend>
			<div class="members-select">
				<p>Choose members</p>
				<div class="members-dropdown">
					{#each friends as friend}
						<label>
							{friend.username}
							<input type="checkbox" value={friend.id} bind:group={newMembers} />
						</label>
					{/each}
				</div>
			</div>
			<Button disabled={newMembers.length < 1} onClick={addMembers} variant="success">Add</Button>
		</fieldset>
	{/if}
</div>

<style>
	.members-select {
		position: relative;
		width: fit-content;
	}

	.members-dropdown {
		position: absolute;
		width: 100%;
		background-color: var(--text-primary);
		color: var(--background-primary);
		display: none;
	}

	.members-dropdown label {
		display: block;
	}

	fieldset.members {
		display: flex;
	}

	.settings-field + .settings-field {
		margin-top: 1.75rem;
	}

	input {
		display: block;
	}
</style>
