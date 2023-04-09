<script lang="ts">
	import { onMount } from 'svelte';
	import Modal from '../Modal/Modal.svelte';

	export let onClose: () => void,
		timeToExpire = 2000;

	onMount(() => {
		const timeout = setTimeout(() => {
			onClose();
		}, timeToExpire);

        return () => clearTimeout(timeout);
	});
</script>

<Modal {onClose}>
	<slot />
</Modal>
