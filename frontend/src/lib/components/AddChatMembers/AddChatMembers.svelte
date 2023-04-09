<script lang="ts">
	import chatService from '$lib/services/chatService';
	import Button from '$lib/components/Button/Button.svelte';
	import type { ShortUser, User } from '$lib/types/types';
	import { chatState } from '$lib/store/chatState';
	import { userBanned } from '$lib/utils/utils';

	export let members: ShortUser[] = [],
		chatId: string = '',
		friends: User[],
		newChat: boolean = false;

	export let newMembers = [] as string[];
	// $: console.log(newMembers, chatId);

	function addMembers(e: Event) {
		e.preventDefault();
		if (newMembers.length) {
			chatService.addMembers(newMembers, chatId);
			newMembers = [];
			isDropdownActive = false;
		}
	}

	$: isDropdownActive = false;

	function isChatMember(id: string) {
		return members.findIndex((item) => item.id === id) > -1;
	}
</script>

<fieldset class="members {newChat && 'new-chat'}">
	{#if newChat}
		<p class="section-header">Add members</p>
	{:else}
		<legend> Add members </legend>
	{/if}
	<div class="members-select">
		<label for="toggle-dropdown">
			<p>choose friends ▽ {newMembers.length ? `(${newMembers.length})` : ''}</p>
			<input
				type="checkbox"
				id="toggle-dropdown"
				class="visually-hidden"
				bind:checked={isDropdownActive}
			/>
		</label>
		<div class="members-dropdown" class:active={isDropdownActive}>
			{#each friends as { id, username }}
				{#if !isChatMember(id) && !userBanned(id, chatId)}
					<label for={id} class="member-option" class:chosen={newMembers.includes(id)}>
						{username}
						<input
							{id}
							type="checkbox"
							value={id}
							bind:group={newMembers}
							class="visually-hidden"
						/>
					</label>
				{/if}
			{/each}
		</div>
	</div>
	{#if !newChat}
		<Button
			className="members-add-btn"
			disabled={newMembers.length < 1}
			onClick={addMembers}
			variant="success">Add</Button
		>
	{/if}
</fieldset>

<style>
    :global(::-webkit-scrollbar) {
		display: none;
	}

	fieldset {
		padding: 1.5rem 1rem;
	}

	.section-header {
		margin-bottom: 0.5rem;
	}

	.members label {
		cursor: pointer;
	}

	.members-select {
		position: relative;
		width: fit-content;
	}

	.members-dropdown {
		position: absolute;
        top: 1.85rem;
		width: 100%;
		max-width: 15.75rem;
		background-color: var(--text-primary);
		color: var(--background-primary);
		display: none;
		max-height: 10rem;
		overflow-y: auto;
	}

	.members-dropdown {
        padding: .25rem;
    }

	.members-dropdown.active {
		display: block;
	}

	.member-option {
		width: 100%;
		padding: 0.35rem 0.25rem;
		display: block;
	}

	.member-option.chosen {
		background-color: var(--color-accent-blue);
		color: var(--text-primary);
	}

	fieldset.members {
		display: flex;
	}

	fieldset.members.new-chat {
		display: block;
		border: none;
		padding: 0;
	}
</style>
