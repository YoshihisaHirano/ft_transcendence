<script lang="ts">
	import '/src/styles/colors.css';
	import '/src/styles/animations.css';
	import '/src/styles/global.css';
	import Header from '$lib/components/Header/Header.svelte';
	import AuthLayout from '$lib/components/AuthLayout/AuthLayout.svelte';
	import Modal from '$lib/components/Modal/Modal.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import { statusIo } from '$lib/sockets/statusSocket';
	import { page } from '$app/stores';
	import userService from '$lib/services/userService';
	import { appState } from '$lib/store/appState';
	import { isGameHost, currentGameId, gameStats, gameStatus, gameMode } from '$lib/store/gameState';
	import { goto } from '$app/navigation';
	import type { GameData, GameInvite } from '$lib/types/types';
	import { onMount } from 'svelte';
	import { resetGame } from '$lib/utils/updates';
	import { availableGames } from '$lib/store/gameWatchState';

	$: activeGameInvitation = false;
	$: secondPlayerName = '';
	$: newGameId = '';
	$: myId = $appState.user?.id || '';
	$: inviteData = {
		gameId: newGameId,
		playerId: myId,
		mode: $gameMode
	} as GameInvite;

	onMount(() => {
		statusIo.on('inviteToGame', async (data: GameInvite) => {
			if (!$page.url.pathname.includes('game')) {
				
				newGameId = data.gameId;
				const user = await userService.getUserById(data.gameId);
				inviteData = { ...inviteData, gameId: data.gameId, mode: data.mode };
				if (user) {
					secondPlayerName = user.username;
					activeGameInvitation = true;
				}
			}
		});

		statusIo.on('canStartGame', (data) => {
			if ($appState?.user) {
				// console.log(data);
				const meHost = $appState.user.id === data.gameId;
				gameMode.set(data.mode);
				isGameHost.set(meHost);
				currentGameId.set(data.gameId);
				gameStatus.set('waiting');
				const resetGameStats = {
					userOneId: data.gameId,
					userOneName: meHost ? data.hostName : data.playerName,
					userOneScore: 0,
					userTwoId: data.playerId,
					userTwoName: !meHost ? data.hostName: data.playerName,
					userTwoScore: 0
				}
				gameStats.set(resetGameStats);
				if (!$page.url.pathname.includes('game')) {
					goto('/game');
				}
			}
		});

		statusIo.on('cancelInvite', () => {
			activeGameInvitation = false;
			secondPlayerName = '';
			newGameId = '';
		});

		statusIo.on('updateGameList', (gameArr: GameData[]) => {
			availableGames.set(gameArr);
		});

		return () => {
			statusIo.off('updateGameList');
			statusIo.off('cancelInvite');
			statusIo.off('canStartGame');
			statusIo.off('inviteToGame');
		}
	});

	function rejectGame() {
		statusIo.emit('rejectInvite', inviteData);
		activeGameInvitation = false;
		secondPlayerName = '';
		newGameId = '';
	}

	function acceptGame() {
		statusIo.emit('inviteAccepted', inviteData);
		activeGameInvitation = false;
		// set to [...game-loading] ?
	}

	$: if($gameStatus && !$page.url.pathname.includes('game')) {
		resetGame();
	}
</script>

<svelte:head>
	<title>FT_Transcendence</title>
</svelte:head>
<AuthLayout>
	<Header />
	<main>
		<slot />
		{#if activeGameInvitation}
			<Modal
				title="Game invitation from {secondPlayerName || 'a friend'}"
				showCloseBtn={false}
				onClose={rejectGame}
			>
				<p>Do you want to join?</p>
				<div class="button-wrapper">
					<Button onClick={acceptGame} variant="success">Accept</Button>
					<Button onClick={rejectGame} variant="danger">Reject</Button>
				</div>
			</Modal>
		{/if}
	</main>
</AuthLayout>

<style>
	main {
		padding: 9rem 0 4rem;
		max-width: 95vw;
		margin: 0 auto;
	}

	.button-wrapper {
		margin-top: 2rem;
	}
</style>
