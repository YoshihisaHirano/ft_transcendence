<script lang="ts">
	import Button from '../Button/Button.svelte';
    import { appState } from '$lib/store/appState';
	import { currentGameId, gameStats, gameStatus, isGameHost } from '$lib/store/gameState';
	import { resetGame } from '$lib/utils/updates';
	import { gameIo } from '$lib/sockets/gameSocket';

	function startNewGame() {
		const user = $appState.user;
        resetGame();
		if (user) {
            if (gameIo.disconnected) {
                gameIo.connect();
            }
			gameStatus.set('matchmaking');
			isGameHost.set(true);
			gameStats.set({
				userOneId: user.id,
				userOneName: user.username,
				userOneScore: 0,
				userTwoScore: 0,
				userTwoId: '',
				userTwoName: ''
			});
			currentGameId.set(user.id);
		}
	}
</script>

<Button onClick={startNewGame} variant="success">START NEW GAME</Button>
