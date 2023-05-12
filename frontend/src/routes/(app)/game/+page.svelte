<script lang="ts">
	/** @type {import('./$types').PageData} */
	import GameScreen from '$lib/components/GameScreen/GameScreen.svelte';
	import Tournament from '$lib/components/Tournament/Tournament.svelte';
	import { currentGameId, gameStats, gameStatus, isGameHost } from '$lib/store/gameState';
	import { onMount, onDestroy } from 'svelte';
	import { gameIo } from '$lib/sockets/gameSocket';
	import { appState } from '$lib/store/appState';
	import { tournamentState } from '$lib/store/tournamentState';

	onMount(() => {
		if (!gameIo.connected) {
			gameIo.connect();
		}

		const userId = $appState.user?.id || '';
		if (userId && !$currentGameId) {
			if (!$gameStatus) {
				gameStatus.set('matchmaking');
			}

			gameStats.set({
				userOneId: userId,
				userOneName: $appState.user?.username || '',
				userOneScore: 0,
				userTwoId: '',
				userTwoName: '',
				userTwoScore: 0
			});
			isGameHost.set(true);
			currentGameId.set(userId);
		}
	});

	onDestroy(() => {
		const canvases = document.querySelectorAll('.p5Canvas');
		Array.from(canvases).forEach((canvas) => {
			canvas.remove();
		});
	});
	
</script>

<div class="game-page">
	{#if $currentGameId}
		<GameScreen />
	{/if}
	<Tournament tournament={$tournamentState} />
</div>

<style>
	.game-page {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		position: relative;
	}

	@media screen and (max-width: 1200px) {
		.game-page {
			flex-direction: column;
			gap: 4rem;
			align-items: center;
		}
	}

	:global(.game-page .game-screen) {
		flex-basis: 75%;
	}
</style>
