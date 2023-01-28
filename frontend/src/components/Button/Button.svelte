<script lang="ts">
	import type { ButtonVariants } from './Button.types';

	export let variant: ButtonVariants;
	export let onClick: (e: MouseEvent) => void;
	export let className: string = '';
</script>

<button on:click={onClick} data-variant={variant} class="{className}">
	<slot />
</button>

<style>
</style>
