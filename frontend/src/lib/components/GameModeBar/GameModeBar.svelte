<script lang="ts">
	import { gameModes } from "$lib/utils/constants";
    import { gameMode } from "$lib/store/gameState";
	import userService from "$lib/services/userService";
	import { onMount } from "svelte";

    onMount(() => {
        gameMode.subscribe(async (val) => {
            await userService.savePreferredMode(val);
        })
    })
</script>

<div class="game-mode-wrapper">
    <p>Your preffered game mode:</p>
    <div class="modes-bar">
        {#each Object.keys(gameModes) as mode}
            <label for="{mode}-mode" title="{mode} mode" class:active={mode == $gameMode}>
                <p>{gameModes[mode].emoji}</p>
                <input id="{mode}-mode" value={mode} bind:group={$gameMode} type="radio" class="visually-hidden">
            </label>
        {/each}
    </div>
</div>

<style>
    .game-mode-wrapper {
        margin-bottom: 1.5rem;
        border: 1px solid rgba(255, 255, 255, .5);
        padding: .5rem;
        text-align: center;
    }

    .modes-bar {
        font-size: 1.5rem;
        line-height: 1.2;
        display: flex;
        margin: .5rem auto;
        width: fit-content;
        gap: .5rem;
    }

    .modes-bar label {
        display: flex;
        padding: .25rem;
        cursor: pointer;
        align-items: center;
    }

    .modes-bar label.active {
        border: 2px solid rgba(255, 255, 255, .8);
        border-radius: 2px;
    }
</style>