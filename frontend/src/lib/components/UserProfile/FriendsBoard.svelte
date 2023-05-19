<script lang="ts">
	import type { ShortUser } from '$lib/types/types';
	import OnlineIndicator from '$lib/components/OnlineIndicator/OnlineIndicator.svelte';
	import UserRecord from './UserRecord.svelte';

	export let friends: ShortUser[], currentId: string;
	// $: // console.log(friends);
</script>

<div class="friends-board-container simple-shadow">
	{#if friends.length}
		{#each friends as { username, status, id }}
			<p>
                <OnlineIndicator userStatus={status} />
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
