<script lang="ts">
	import GameSketch from '$lib/components/GameSketch/GameSketch.svelte';
	import { currentGameId, gameStats, gameStatus, isGameHost } from '$lib/store/gameState';
	import { onMount } from 'svelte';
	import GameOver from './GameOver.svelte';
	import WaitingScreen from './WaitingScreen.svelte';
	import { gameIo } from '$lib/sockets/gameSocket';

	$: gameFailed = false;

	onMount(() => {
		gameIo.on('joinGameFail', () => {
			console.log('JOIN GAME FAILED');
			gameFailed = true;
		})

		gameIo.on('endOfGame', () => {
			gameStatus.set('finished');
		})

		return () => {
			gameIo.off('joinGameFail');
			gameIo.off('endOfGame');
			gameFailed = false;
			$gameStatus = 'waiting';
			$gameStats = null;
			$isGameHost = false;
			$currentGameId = null;
		}
	})
</script>


{#if gameFailed}
	<div>SORRY BUT GAME FAILED :'(</div>
{:else if $gameStatus === 'waiting'}
	<WaitingScreen/>
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
	<GameOver/>
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
