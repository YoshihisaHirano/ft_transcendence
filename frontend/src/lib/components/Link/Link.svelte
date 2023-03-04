<script lang="ts">
	import { goto } from "$app/navigation";

    export let internal: boolean, target: string, className = '' , bg = '#050609';

    function handleClick(e: Event) {
        if (internal) {
            e.preventDefault();
            goto(target);
        }
    }
</script>

<a href={target} on:click={handleClick} style="--btn-bg-color: {bg}" class="four-step-shadow {className}">
    <slot/>
</a>

<style>
    a {
        display: block;
        padding: .5rem .25rem;
        background-color: var(--btn-bg-color);
        box-sizing: border-box;
        width: fit-content;
        color: var(--text-primary)
    }
</style>