<script lang="ts">
	import { gameStats } from '$lib/store/gameState';
	import { gameBeingShown } from '$lib/store/gameWatchState';
	import GameSketch from '../GameSketch/GameSketch.svelte';
	import GameWatchSketch from '../GameWatchSketch/GameWatchSketch.svelte';
	import GameFailWarning from './GameFailWarning.svelte';

	export let isGameWatched: boolean;

	$: playerNames = {
		userOneName: isGameWatched ? $gameBeingShown?.hostName : $gameStats?.userOneName,
		userTwoName: isGameWatched ? $gameBeingShown?.playerName : $gameStats?.userTwoName
	};

	
</script>

{#if !isGameWatched}
	<GameFailWarning />
{:else}
	<GameFailWarning text="Please do not refresh the page, some data might be lost!" />
{/if}
<div class="game-screen">
	<div class="game-field-wrapper">
		<div class="game-info">
			<div class="game-info-right">
				<div class="player-username">{playerNames.userOneName || 'player1'}</div>
				<div class="game-score" id="score1" />
			</div>
			<hr class="score-divider" />
			<div class="game-info-left">
				<div class="player-username">{playerNames.userTwoName || 'player2'}</div>
				<div class="game-score" id="score2" />
			</div>
		</div>
		<div class="canvas-wrapper">
			{#if isGameWatched}
				<GameWatchSketch />
			{:else}
				<GameSketch />
			{/if}
		</div>
	</div>
</div>

<style>
	.game-field-wrapper {
		width: fit-content;
		margin: 0 auto 0;
		padding-top: 6rem;
		min-width: fit-content;
	}

	.canvas-wrapper {
		border: 1px dashed var(--text-primary);
	}

	.game-info {
		display: flex;
		justify-content: space-between;
	}

	.game-info > div {
		flex-basis: 50%;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
	}

	.game-info-left {
		flex-direction: row-reverse;
	}

	.player-username {
		opacity: 0.7;
	}

	.game-score {
		font-size: 2rem;
		padding: 0 0.5rem;
	}

	.score-divider {
		width: 2px;
		opacity: 0.3;
	}
</style>
