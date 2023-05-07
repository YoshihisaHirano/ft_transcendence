<script>
	import GameShow from '$lib/components/GameScreen/GameShow.svelte';
	import Link from '$lib/components/Link/Link.svelte';
	import { gameIo } from '$lib/sockets/gameSocket';
	import { gameBeingShown } from '$lib/store/gameWatchState';
	import { onDestroy, onMount } from 'svelte';

	export let data;
	$: connectionFailed = false;
	$: gameOverActive = false;

	onMount(() => {
		gameIo.emit('spectatorJoinGame', data.slug);

		gameIo.on('joinGameFail', () => {
			connectionFailed = true;
		});

		gameIo.on('endOfGame', () => {
			connectionFailed = true;
		});

		gameIo.on('finishGame', () => {
			gameOverActive = true;
		})

        return () => {
            gameIo.off('joinGameFail');
			gameIo.off('endOfGame');
			gameIo.off('finishGame');
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
	<div class="game-over" class:active={gameOverActive}>
		<div class="banner">
			<p>GAME OVER</p>
			<div class="versus">
				<p>{$gameBeingShown?.hostName}</p>
				<p class="vs {$gameBeingShown?.gameMode}">VS</p>
				<p>{$gameBeingShown?.playerName}</p>
			</div>
		</div>
		<Link target="/" internal>Back to home</Link>
	</div>
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

	.game-over {
		text-align: center;
		width: fit-content;
		padding: 2rem 2.5rem;
		display: none;
	}

	.game-over.active {
		display: block;
		margin: 0 auto;
		border: 1px dashed white;
		width: 80%;
	}

	.banner {
		margin-bottom: 1.5rem;
	}

	.banner > p {
		font-size: 2rem;
		margin-bottom: 1.5rem;
	}

	.versus {
		display: flex;
		gap: 1rem;
		font-size: 1.75rem;
	}

	.versus p {
		flex-basis: 40%;
		flex-shrink: 0;
	}

	.versus p.vs {
		flex-basis: 10%;
	}

	.vs.easy {
		color: #73fc03;
	}

	.vs.default {
		color: #0362fc;
	}

	.vs.hard {
		color: #fc037b;
	}
</style>
