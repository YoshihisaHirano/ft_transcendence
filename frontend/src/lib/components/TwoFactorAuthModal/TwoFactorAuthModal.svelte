<script>
	import { onMount } from "svelte";
	import Modal from "../Modal/Modal.svelte";

    $: imageSrc = '';

    onMount(() => {
        const res = fetch(`${import.meta.env.VITE_BACKEND_URL}/2fa/generate`, { method: 'POST'})
    })
</script>

<Modal onClose={() => {/**/}}>
    <div>
        <img src={imageSrc} alt="">
    </div>
</Modal>