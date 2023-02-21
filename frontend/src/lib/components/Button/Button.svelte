<script lang="ts">
	import type { ButtonVariants } from './Button.types';

	export let variant: ButtonVariants;
	export let onClick: (e: MouseEvent) => void;
	export let className: string = '';
</script>

<button on:click={onClick} data-variant={variant} class="simple-shadow {className}">
	<slot />
</button>

<style>
	button {
		border: 1px solid rgba(0,0,0,.5);
		cursor: pointer;
	}
	button[data-variant="success"] {
		background-color: #2CB01A;
	}
	button[data-variant="danger"] {
		background-color: #E52521;
	}
	button[data-variant="warning"] {
		background-color: #FBD000;
	}
</style>
