<script lang="ts">
	import { appState } from '$lib/store/appState';
	import type { Tournament } from '$lib/types/types';
	import UserRecord from '../UserProfile/UserRecord.svelte';

	export let tournament: Tournament[];
</script>

<div class="tournament-container simple-shadow">
	<ol>
		{#each tournament as { playerId, username, wins }}
			<li class="record-container">
				<UserRecord userId={playerId} {username} currentId={$appState.user?.id || ''} />
				<span>{wins}</span>
			</li>
		{/each}
	</ol>
</div>

<style>
	.tournament-container {
		padding: 1rem 0.65rem;
		margin-left: 1rem;
		margin-right: 1rem;
	}

	ol {
		list-style-position: inside;
		padding-left: 0;
	}

	.record-container {
		/* display: flex;
		gap: 0.5rem; */
	}

	li + li {
		margin-top: .45rem;
	}
</style>
