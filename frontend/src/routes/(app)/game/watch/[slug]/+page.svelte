<script>
	import GameShow from '$lib/components/GameScreen/GameShow.svelte';
	import Link from '$lib/components/Link/Link.svelte';
	import { gameIo } from '$lib/sockets/gameSocket';
	import { onDestroy, onMount } from 'svelte';

	export let data;
	$: connectionFailed = false;

	onMount(() => {
		gameIo.emit('spectatorJoinGame', data.slug);

		gameIo.on('joinGameFail', () => {
			connectionFailed = true;
		});

        return () => {
            gameIo.off('joinGameFail');
        }
	});

    onDestroy(() => {
		const canvases = document.querySelectorAll('.p5Canvas');
		Array.from(canvases).forEach((canvas) => {
			canvas.remove();
		});
	});
</script>

<div class="game-watch-wrapper {connectionFailed ? 'failed' : ''}">
	{#if connectionFailed}
		<p>Something went wrong, please try again :(</p>
		<Link target="/" internal>Back to home</Link>
	{:else}
		<GameShow isGameWatched={true} />
	{/if}
</div>

<style>
    :global(.failed ~ canvas) {
        display: none;
    }

    .game-watch-wrapper {
        position: relative;
    }

    .game-watch-wrapper p {
        margin: 1rem auto 3rem;
        width: fit-content;
    }
</style>
