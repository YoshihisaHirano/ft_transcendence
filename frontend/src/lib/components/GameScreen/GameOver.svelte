<script lang="ts">
	import { appState } from '$lib/store/appState';
	import { currentGameId, gameStats, gameStatus, isGameHost } from '$lib/store/gameState';
	import Button from '../Button/Button.svelte';

	function startNewGame() {
		const user = $appState.user;
		if (user) {
			gameStatus.set('waiting');
			isGameHost.set(true);
			gameStats.set({
				userOneId: user.id,
				userOneName: user.username,
				userOneScore: 0,
				userTwoScore: 0,
				userTwoId: '',
				userTwoName: ''
			});
			currentGameId.set(user.id);
		}
	}
</script>

<div class="game-screen game-over">
	<div class="game-screen-wrapper">
		{#if $gameStats}
			<div class="game-results">
				<div class="result-score">
					<p>{$gameStats.userOneScore}</p>
					<hr />
					<p>{$gameStats.userTwoScore}</p>
				</div>
				<div class="players">
					<div>
						<p>{$gameStats.userOneName}</p>
					</div>
					<div>
						<p>{$gameStats.userTwoName}</p>
					</div>
				</div>
			</div>
		{/if}
		<p>GAME OVER</p>
		<Button onClick={startNewGame} variant="success">START NEW GAME</Button>
	</div>
</div>

<style>
	.game-over {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	.game-results {
		padding: 2.5rem 1.5rem 1.5rem;
		border: 1px dashed rgba(255, 255, 255, 0.4);
		border-radius: 10px;
		width: 90%;
		margin: 0 auto;
	}

	.game-results + p {
		font-size: 2.5rem;
		margin: 3.5rem auto 2rem;
		width: fit-content;
	}

	.result-score {
		display: flex;
		justify-content: center;
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	.result-score p {
		padding: 0 0.75rem;
	}

	.players {
		display: flex;
		justify-content: space-between;
		opacity: 0.8;
	}

	.players > div {
		flex-basis: 50%;
		flex-shrink: 0;
	}

	.players div:last-child p {
		text-align: end;
	}

	:global(.game-results + p + button) {
		margin: 2rem auto;
		width: fit-content;
		display: block;
	}

	.game-screen-wrapper {
		display: flex;
		flex-direction: column;
		width: 80%;
	}
</style>
