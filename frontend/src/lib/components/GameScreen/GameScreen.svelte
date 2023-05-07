<script lang="ts">
	import { gameStats, gameStatus } from '$lib/store/gameState';
	import { onMount } from 'svelte';
	import GameOver from './GameOver.svelte';
	import WaitingScreen from './WaitingScreen.svelte';
	import { gameIo } from '$lib/sockets/gameSocket';
	import MatchmakingScreen from './MatchmakingScreen.svelte';
	import { resetGame } from '$lib/utils/updates';
	import GameFailed from './GameFailed.svelte';
	import StartNewGame from '../StartNewGame/StartNewGame.svelte';
	import GameShow from './GameShow.svelte';

	onMount(() => {
		gameIo.on('joinGameFail', () => {
			
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
	<GameShow isGameWatched={false}/>
{:else if $gameStatus === 'finished'}
	<GameOver />
{:else}
	<StartNewGame/>
{/if}

