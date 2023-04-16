<script lang="ts">
	import { appState } from '$lib/store/appState';
	import enigma from '$lib/images/enigma.svg';
	import { onMount } from 'svelte';
	import { currentGameId, gameStats, gameStatus, isGameHost } from '$lib/store/gameState';
	import JumpingDots from '../JumpingDots/JumpingDots.svelte';
	import { gameIo } from '$lib/sockets/gameSocket';
	import { statusIo } from '$lib/sockets/statusSocket';

	onMount(() => {
		if (!($currentGameId) || !($gameStats)) {
			return;
		}
		if (!($gameStats.userTwoId)) {
			statusIo.emit('matchMakingGame', $currentGameId)
		} else if ($isGameHost) {
			gameIo.emit('createGame', {
				gameId: $currentGameId,
				playerId: $gameStats.userTwoId
			})
		} else {
			gameIo.emit('playerJoinGame', {
				gameId: $currentGameId,
				playerId: $gameStats.userTwoId
			})
		}

		gameIo.on('gameStart', () => {
			console.log('GAME STARTED')
			gameStatus.set('in progress');
		});

		return () => {
			gameIo.off('gameStart');
		}
	});
</script>

<div class="waiting-wrapper game-screen">
	<div>
		{#if $appState.user && $gameStats}
			<div class="versus-wrapper">
				<div class="image-frame">
					<img src={enigma} alt="player one pic" />
					<p class="player-name">{$gameStats.userOneName}</p>
				</div>
				<p>VS</p>
				<div class="image-frame">
					<img src={enigma} alt="question mark" />
					<p class="player-name">{$gameStats.userTwoName}</p>
				</div>
			</div>
		{/if}
		<div>
			Waiting for someone to join the game
			<JumpingDots/>
		</div>
	</div>
</div>

<style>
	.waiting-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.image-frame {
		width: 7rem;
		height: 7rem;
		border: 1px solid white;
	}

	.image-frame img {
		aspect-ratio: 1 / 1;
		max-width: 100%;
		height: auto;
		object-fit: cover;
	}

	.versus-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-bottom: 3rem;
		height: fit-content;
	}

	.versus-wrapper p {
		font-size: 3rem;
		padding: 0 2rem;
	}

	p.player-name {
		font-size: 1rem;
	}
</style>
