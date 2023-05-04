<script lang="ts">
	/** @type {import('./$types').PageData} */
	import GameScreen from '$lib/components/GameScreen/GameScreen.svelte';
	import Tournament from '$lib/components/Tournament/Tournament.svelte';
	import { currentGameId, gameStats, gameStatus, isGameHost } from '$lib/store/gameState';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { gameIo } from '$lib/sockets/gameSocket';
	import { appState } from '$lib/store/appState';

	export let data: PageData;
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
	// $: console.log($gameStatus);
</script>

<div class="game-page">
	{#if $currentGameId}
		<GameScreen />
	{/if}
	<Tournament tournament={data.tournament} />
</div>

<style>
	.game-page {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	@media screen and (max-width: 900px) {
		.game-page {
			flex-direction: column;
			gap: 4rem;
		}
	}

	:global(.game-page .game-screen) {
		flex-basis: 75%;
	}
</style>
