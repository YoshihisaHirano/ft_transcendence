<script lang="ts">
	// import GameInvitation from '../GameInvitation/GameInvitation.svelte';
	import StartNewGame from '../StartNewGame/StartNewGame.svelte';
	// import { gameStats } from '$lib/store/gameState';
	// import { appState } from '$lib/store/appState';
	// import { onMount } from 'svelte';
	// import { gameIo } from '$lib/sockets/gameSocket';

    // $: userId = $appState.user?.id || '';

    // onMount(() => {
    //     gameIo.disconnect();
    // })
</script>

<div class="game-fail-wrapper">
	SORRY BUT THE GAME IS LOST :'(
	<div>
		<!-- {#if $gameStats}
			YOU CAN EITHER TRY TO
			<div class="options-buttons">
				<div class="reinvite-container">
					RE-INVITE FRIEND ->
					<GameInvitation
						playerId={userId === $gameStats.userOneId ? $gameStats.userTwoId : $gameStats.userOneId}
						playerName={userId === $gameStats.userOneId ? $gameStats.userTwoName : $gameStats.userOneName}
					/>
				</div>
				<p>OR</p>
				<StartNewGame />
			</div>
		{:else} -->
            <p>YOU CAN TRY ANOTHER ONE</p>
			<StartNewGame />
		<!-- {/if} -->
	</div>
</div>

<style>
	.game-fail-wrapper {
		width: fit-content;
		margin: 0 auto;
		text-align: center;
		line-height: 2;
	}

    .game-fail-wrapper p {
        margin-bottom: 1rem;
    }

	/* .options-buttons {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding-top: 1.5rem;
	}

	.reinvite-container {
		border: 1px solid white;
		border-radius: 5px;
		padding: 0.5rem 0.65rem;
		width: fit-content;
		margin: 0 auto;
	} */
</style>
