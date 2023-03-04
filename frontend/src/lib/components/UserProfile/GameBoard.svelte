<script lang="ts">
	import type { GameStats } from '$lib/types/types';
	import UserRecord from './UserRecord.svelte';

	export let wins: number, loses: number, matchHistory: GameStats[], currentId: string;
</script>

<div class="match-history-board simple-shadow">
	<div class="board-header">
		<p>WON</p>
		<p>LOST</p>
	</div>
	<div class="board-stats">
		<p>{wins}</p>
		<div>|</div>
		<p>{loses}</p>
	</div>
</div>
<div class="matches-list simple-shadow">
	{#if matchHistory.length}
		{#each matchHistory as match}
			<div class="matches-list-item">
				<p>
					<UserRecord username={match.userOneName} userId={match.userOneId} {currentId} />
					<span>{match.userOneScore}</span>
				</p>
				<div class="matches-list-item-separator">:</div>
				<p>
					<span>{match.userTwoScore}</span>
					<UserRecord username={match.userTwoName} userId={match.userTwoId} {currentId} />
				</p>
			</div>
		{/each}
	{:else}
		<p class="no-matches">no records here...</p>
	{/if}
</div>

<style>
	.match-history-board {
		padding: 1rem 0.75rem;
	}

	.board-header {
		display: flex;
		justify-content: space-between;
	}

	.board-stats {
		display: flex;
		justify-content: center;
		font-size: 3.5rem;
	}

	.board-stats p {
		flex-basis: 45%;
	}

	.board-stats p:first-child {
		color: #00ffff;
		text-align: end;
	}

	.board-stats p:last-child {
		color: #e52521;
	}

	.matches-list {
		width: 90%;
		padding: 1rem 0.75rem;
		margin-bottom: 2.5rem;
		max-height: 5.5rem;
		overflow-y: auto;
		opacity: 0.8;
	}

	.matches-list-item {
		display: flex;
		justify-content: center;
	}

	.matches-list-item p {
		flex-basis: 40%;
	}

	.matches-list-item-separator {
		flex-basis: 5%;
		text-align: center;
	}

	.matches-list-item p:first-child {
		text-align: end;
	}

	::-webkit-scrollbar {
		display: none;
	}

	.no-matches {
		text-align: center;
	}
</style>
