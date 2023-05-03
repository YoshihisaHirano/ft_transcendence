<script lang="ts">
	import { onMount } from 'svelte';
	import Modal from '../Modal/Modal.svelte';
	import Button from '../Button/Button.svelte';

	export let onClose: () => void, login: string;

	$: imageSrc = '';

	onMount(() => {
        // add qr code image
		// const res = fetch(`${import.meta.env.VITE_BACKEND_URL}/2fa/generate`, 
        // { method: 'POST', body: JSON.stringify({ login }) });
        // console.log(res);
	});

    function submitCode() {
        /*submit digits logic*/
    }
</script>

<Modal {onClose} title="Enable two factor authentication">
    <div class="modal-container">
        <div class="image-frame">
            <img src={imageSrc} alt="" />
        </div>
        <p>Please scan the QR code with your authentication app and insert the digits from it below.</p>
        <label for="2fa-code-input">
            <input id="2fa-code-input" type="text" />
        </label>
        <Button onClick={submitCode} variant="success">Submit</Button>
    </div>
</Modal>

<style>

    .modal-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

	.image-frame {
		width: 13rem;
		height: 13rem;
		border: 1px solid white;
		margin-bottom: 2rem;
	}

	.image-frame img {
		aspect-ratio: 1 / 1;
		max-width: 100%;
		height: auto;
		object-fit: cover;
	}

    p {
        max-width: 75%;
        text-align: center;
        margin-bottom: 1rem;
    }

    input {
        margin-bottom: 1.5rem;
    }
</style>
