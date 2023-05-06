<script lang="ts">
	import { gamesToWatch } from '$lib/mockData/mockData';
	import { statusIo } from '$lib/sockets/statusSocket';
	import { availableGames, gameBeingShown } from '$lib/store/gameWatchState';
	import type { GameData } from '$lib/types/types';
	import { onMount } from 'svelte';
	import UserRecord from './UserRecord.svelte';
	import { appState } from '$lib/store/appState';
	import { goto } from '$app/navigation';

	$: currentId = $appState.user?.id || '';

	onMount(() => {
		statusIo.on('updateGameList', (gameArr: GameData[]) => {
			availableGames.set(gameArr);
		});

		//mocking
		availableGames.set(gamesToWatch);

		return () => {
			statusIo.off('updateGameList');
		};
	});

	function setCurrentGameData(e: Event) {
		e.preventDefault();
		const target = e.target as HTMLAnchorElement;
        const game = target.dataset.game;
        // console.log(game);
        if (game) {
            const gameData = JSON.parse(game) as GameData;
            // console.log(gameData);
            gameBeingShown.set(gameData);
            goto(target.href);
        }
	}
</script>

<div class="current-games-wrapper">
	<p>Current games you can watch:</p>
	<div class="four-step-shadow games-wrapper">
		{#if $availableGames.length}
			<div class="game-records">
				{#each $availableGames as game}
					<div>
						<UserRecord {currentId} username={game.hostName} userId={game.gameId} />
						<a
							on:click={setCurrentGameData}
							title="watch the game"
							class="game-link {game.gameMode}"
							href="/game/watch/{game.gameId}"
							data-game={JSON.stringify(game)}
						>
							VS
						</a>
						<UserRecord {currentId} username={game.playerName} userId={game.playerId} />
					</div>
				{/each}
			</div>
		{:else}
			<p>no one is playing right now...</p>
		{/if}
	</div>
</div>

<style>
	.current-games-wrapper {
		padding: 1rem 0.75rem;
		width: 95%;
		margin: 2rem auto;
	}

	.games-wrapper .game-records {
		padding: 1rem 0.75rem;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 0.5rem;
	}

	.games-wrapper > p {
		text-align: center;
		padding: 1rem 0.75rem;
	}

	.current-games-wrapper > p {
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.game-records > div {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	a.game-link,
	a.game-link:visited,
	a.game-link:active {
		font-size: 1.25rem;
		text-decoration: none;
	}

	a.game-link.easy {
		color: #73fc03;
	}

	a.game-link.default {
		color: #0362fc;
	}

	a.game-link.hard {
		color: #fc037b;
	}
</style>
