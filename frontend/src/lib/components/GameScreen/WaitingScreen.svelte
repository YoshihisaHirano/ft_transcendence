<script lang="ts">
	import { onMount } from 'svelte';
	import { currentGameId, gameMode, gameStats, gameStatus, isGameHost } from '$lib/store/gameState';
	import { gameIo } from '$lib/sockets/gameSocket';
	import JumpingDots from "../JumpingDots/JumpingDots.svelte";
	import GameFailWarning from './GameFailWarning.svelte';

	onMount(() => {
		if (!$currentGameId || !$gameStats) {
			return;
		}
		if ($isGameHost) {
			gameIo.emit('createGame', {
				gameId: $currentGameId,
				playerId: $gameStats.userTwoId,
				mode: $gameMode
			});
		} else {
			gameIo.emit('playerJoinGame', {
				gameId: $currentGameId,
				playerId: $gameStats.userTwoId,
				mode: $gameMode
			});
		}

		gameIo.on('gameStart', () => {
			gameStatus.set('in progress');
		});

		return () => {
			gameIo.off('gameStart');
		};
	});
</script>


<GameFailWarning/>
<div>
	Waiting for your partner to join <JumpingDots />
</div>

<style>
	div {
		padding-top: 5rem;
	}
</style>
