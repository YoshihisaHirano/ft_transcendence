<script lang="ts">
	import { onMount } from 'svelte';
	import Modal from '../Modal/Modal.svelte';

	export let onClose: () => void,
		timeToExpire = 3000;
    
    $: modalClosed = false;

    function followClose() {
        modalClosed = true;
        onClose();
    }

	onMount(() => {
		const timeout = setTimeout(() => {
            if (!modalClosed) {
                onClose();
            }
		}, timeToExpire);

        return () => clearTimeout(timeout);
	});
</script>

<Modal onClose={followClose}>
	<slot />
</Modal>
