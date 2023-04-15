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
	import { isGameHost, currentGameId, gameStats } from '$lib/store/gameState';
	import { goto } from '$app/navigation';
	import type { GameInvite } from '$lib/types/types';

	$: activeGameInvitation = false;
	$: secondPlayerName = '';
	$: newGameId = '';
	$: myId = $appState.user?.id || '';
	$: inviteData = {
		gameId: newGameId,
		playerId: myId
	} as GameInvite;

	statusIo.on('inviteToGame', async (gameId: string) => {
		console.log('AN INITATION RECEIVED', gameId);
		if (!$page.url.pathname.includes('game')) {
			newGameId = gameId;
			const user = await userService.getUserById(gameId);
			if (user) {
				secondPlayerName = user.username;
				activeGameInvitation = true;
			}
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
		// set to [...game-loading]
	}

	statusIo.on('canStartGame', ({ gameId, playerId }: GameInvite) => {
		if ($appState?.user) {
			const meHost = $appState.user.id === gameId;
			isGameHost.set(meHost);
			currentGameId.set(gameId);
			gameStats.set({
				userOneId: gameId,
				userOneName: meHost ? $appState.user.username : secondPlayerName,
				userOneScore: 0,
				userTwoId: playerId,
				userTwoName: !meHost ? $appState.user.username : secondPlayerName,
				userTwoScore: 0
			});
			goto('/game');
		}
	});

	statusIo.on('cancelInvite', () => {
		activeGameInvitation = false;
		secondPlayerName = '';
		newGameId = '';
	})
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
