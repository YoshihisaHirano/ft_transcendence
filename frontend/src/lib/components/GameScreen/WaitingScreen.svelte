<script lang="ts">
	import { appState } from '$lib/store/appState';
	import { onMount } from 'svelte';
	import { currentGameId, gameStats, gameStatus, isGameHost } from '$lib/store/gameState';
	import { gameIo } from '$lib/sockets/gameSocket';
	import { statusIo } from '$lib/sockets/statusSocket';
	import JumpingDots from "../JumpingDots/JumpingDots.svelte";

	onMount(() => {
		if (!$currentGameId || !$gameStats) {
			return;
		}
		if ( $isGameHost) {
			gameIo.emit('createGame', {
				gameId: $currentGameId,
				playerId: $gameStats.userTwoId
			});
		} else {
			gameIo.emit('playerJoinGame', {
				gameId: $currentGameId,
				playerId: $gameStats.userTwoId
			});
		}

		gameIo.on('gameStart', () => {
			console.log('GAME STARTED');
			gameStatus.set('in progress');
		});

		return () => {
			gameIo.off('gameStart');
		};
	});
</script>


<div>
	Waiting for your partner to join <JumpingDots />
</div>


