<script lang="ts">
	import GameSketch from '$lib/components/GameSketch/GameSketch.svelte';
	import { gameStats, gameStatus } from '$lib/store/gameState';
	import { onMount } from 'svelte';
	import GameOver from './GameOver.svelte';
	import WaitingScreen from './WaitingScreen.svelte';
	import { gameIo } from '$lib/sockets/gameSocket';
	import MatchmakingScreen from './MatchmakingScreen.svelte';
	import { resetGame } from '$lib/utils/updates';
	import GameFailed from './GameFailed.svelte';
	import StartNewGame from '../StartNewGame/StartNewGame.svelte';

	onMount(() => {
		gameIo.on('joinGameFail', () => {
			console.log('JOIN GAME FAILED');
			$gameStatus = 'failed';
		});

		gameIo.on('endOfGame', () => {
			$gameStatus = 'failed';
		})

		gameIo.on('finishGame', () => {
			gameStatus.set('finished');
		});

		return () => {
			gameIo.off('joinGameFail');
			gameIo.off('endOfGame');
			resetGame();
		};
	});
</script>

{#if $gameStatus === 'failed'}
	<GameFailed/>
{:else if $gameStatus === 'matchmaking'}
	<MatchmakingScreen />
{:else if $gameStatus === 'waiting'}
	<WaitingScreen />
{:else if $gameStatus === 'in progress'}
	<div class="game-screen">
		<div class="game-field-wrapper">
			<div class="game-info">
				<div class="game-info-right">
					<div class="player-username">{$gameStats?.userOneName || 'player1'}</div>
					<div class="game-score" id="score1" />
				</div>
				<hr class="score-divider" />
				<div class="game-info-left">
					<div class="player-username">{$gameStats?.userTwoName || 'player2'}</div>
					<div class="game-score" id="score2" />
				</div>
			</div>
			<div class="canvas-wrapper">
				<GameSketch />
			</div>
		</div>
	</div>
{:else if $gameStatus === 'finished'}
	<GameOver />
{:else}
	<StartNewGame/>
{/if}

<style>
	.game-field-wrapper {
		width: fit-content;
		margin: 0 auto;
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
