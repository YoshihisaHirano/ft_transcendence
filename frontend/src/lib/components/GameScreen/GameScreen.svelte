<script lang="ts">
	import GameSketch from "$lib/components/GameSketch/GameSketch.svelte";

    export let player1: string, player2: string;
</script>

<div class="game-field-wrapper">
    <div class="game-info">
        <div class="game-info-right">
            <div class="player-username">{player1 || 'player1'}</div>
            <div class="game-score" id="score1"></div>
        </div>
        <hr class="score-divider"/>
        <div class="game-info-left">
            <div class="player-username">{player2 || 'player2'}</div>
            <div class="game-score" id="score2"></div>
        </div>
    </div>
    <div class="canvas-wrapper">
        <GameSketch />
    </div>
</div>

<style>
    .game-field-wrapper {
        width: fit-content;
        margin: 0 auto;
    }

    .canvas-wrapper {
        border: 1px dashed var(--text-primary);
    }

    .game-info {
        display: flex;
        justify-content: space-between;
    }

    .game-info > div {
        flex-basis: 50%;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }

    .game-info-left {
        flex-direction: row-reverse;
    }

    .player-username {
        opacity: .7;
    }

    .game-score {
        font-size: 2rem;
        padding: 0 .5rem;
    }

    .score-divider {
        width: 2px;
        opacity: .3;
    }
</style>