<script lang="ts">
	import type { User } from '$lib/types/types';
	import UserRecord from './UserRecord.svelte';

	export let friends: User[], currentId: string;
</script>

<div class="friends-board-container simple-shadow">
	{#if friends.length}
		{#each friends as { username, isOnline, id }}
			<p>
                <span class="online-indicator" class:active={isOnline}/>
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

    .online-indicator {
        display: inline-block;
        height: 1rem;
        width: 1rem;
        border-radius: 50%;
        opacity: .8;
        background-color: #996611;
    }

    .online-indicator.active {
        background-color: #43B047;
    }
</style>
