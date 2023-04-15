<script lang="ts">
	import { appState } from '$lib/store/appState';
	import enigma from '$lib/images/enigma.svg';
	import { onMount } from 'svelte';
	import { gameStats, gameStatus } from '$lib/store/gameState';
	import JumpingDots from '../JumpingDots/JumpingDots.svelte';

	/* imitation of getting the second player */
	onMount(() => {
		setTimeout(() => {
			gameStatus.set('in progress');
			gameStats.update((val) => {
				if (val) {
					return { ...val, userTwoName: 'happy-noring' }
				}
				return null;
			})
		}, 3000);
	});
</script>

<div class="waiting-wrapper game-screen">
	<div>
		{#if $appState.user}
			<div class="versus-wrapper">
				<div class="image-frame">
					<img src={$appState.user.image} alt="player one pic" />
				</div>
				<p>VS</p>
				<div class="image-frame">
					<img src={enigma} alt="question mark" />
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
	}

	.versus-wrapper p {
		font-size: 3rem;
		padding: 0 2rem;
	}
</style>
