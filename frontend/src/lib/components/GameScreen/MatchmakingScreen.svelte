<script lang="ts">
	import { appState } from '$lib/store/appState';
	import { currentGameId, gameStats, gameMode } from '$lib/store/gameState';
	import JumpingDots from '../JumpingDots/JumpingDots.svelte';
	import enigma from '$lib/images/enigma.svg';
	import { onMount } from 'svelte';
	import { statusIo } from '$lib/sockets/statusSocket';
	import GameFailWarning from './GameFailWarning.svelte';

	onMount(() => {
		statusIo.emit('matchMakingGame', { userId: $currentGameId, mode: $gameMode });
	});
</script>

<GameFailWarning/>
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
					<p class="player-name">{$gameStats.userTwoName || "???"}</p>
				</div>
			</div>
		{/if}
		<div>
			Waiting for someone to join the game
			<JumpingDots />
		</div>
	</div>
</div>

<style>
	.waiting-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		padding-top: 5rem;
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
		/* height: fit-content; */
	}

	.versus-wrapper div + p {
		font-size: 3rem;
		padding: 0 2rem;
	}

	p.player-name {
		font-size: 1rem;
		margin-top: .5rem;
		text-align: center;
	}
</style>
