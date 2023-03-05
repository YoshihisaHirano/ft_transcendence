<script lang="ts">
	import type { User } from '$lib/types/types';
	import OnlineIndicator from '$lib/components/OnlineIndicator/OnlineIndicator.svelte';
	import UserRecord from './UserRecord.svelte';

	export let friends: User[], currentId: string;
</script>

<div class="friends-board-container simple-shadow">
	{#if friends.length}
		{#each friends as { username, isOnline, id }}
			<p>
                <OnlineIndicator {isOnline} />
                <UserRecord {username} userId={id} {currentId}  />
            </p>
		{/each}
	{:else}
		<p>no friends yet...</p>
	{/if}
</div>

<style>
	.friends-board-container {
		padding: 1rem 0.75rem;
		width: 85%;
		margin: 2rem auto;
	}
</style>
