<script lang="ts">
	/** @type {import('./$types').PageData} */
	import GameScreen from '$lib/components/GameScreen/GameScreen.svelte';
	import Tournament from '$lib/components/Tournament/Tournament.svelte';
	import { gameState } from '$lib/store/gameState';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="game-page">
	{#if $gameState}
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

	:global(.game-page .game-screen) {
		flex-basis: 75%;
	}
</style>
