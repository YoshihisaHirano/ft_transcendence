<script lang="ts">
	import { onMount } from 'svelte';
	import Modal from '../Modal/Modal.svelte';
	import Button from '../Button/Button.svelte';
	import authService from '$lib/services/authService';
	import { goto } from '$app/navigation';
	import { appState } from '$lib/store/appState';
	import { saveToStorage } from '$lib/utils/storage';

	export let onClose: () => void, login: string, action: 'enable' | 'disable' | 'login';

	$: imageSrc = '';
	let inputValue: string;
	$: errMsg = '';
	const modalTitle = action == 'login' ? 'Login using' : action;

	onMount(async () => {
		if (action === 'enable') {
			const res = await authService.generateQRcode(login);
			const blob = await res.blob();
			imageSrc = URL.createObjectURL(blob);
		}
	});

	async function submitCode() {
		let res: any;
		
		if (action !== 'login') {
			res = await authService.toggleSwitch2Fa(inputValue, login);
		} else {
			res = await authService.verifyCode(inputValue, login);
		}
		
		if (res && 'error' in res) {
			errMsg = res.message;
		} else {
			errMsg = '';
			if (action === 'login') {
				saveToStorage('userId', res.id);
				goto('/');
			} else {
				appState.update((val) => {
					if (val.user) {
						return {
							user: { ...val.user, twoFactorAuthIsEnabled: !val.user.twoFactorAuthIsEnabled }
						};
					}
					return { user: null };
				});
				onClose();
			}
		}
		inputValue = '';
	}
</script>

<Modal
	showCloseBtn={action !== 'login'}
	{onClose}
	title={errMsg || `${modalTitle} two factor authentication`}
>
	<div class="modal-container" class:error={errMsg}>
		{#if action === 'enable'}
			<div class="image-frame">
				<img src={imageSrc} alt="" />
			</div>
		{/if}
		<p>
			{#if action === 'enable'}
				Please scan the QR code with your authentication app and insert the digits from it below.
			{:else}
				Please enter the digits from your authentication app.
			{/if}
		</p>
		<label for="2fa-code-input">
			<input bind:value={inputValue} type="text" id="2fa-code-input" />
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

	.modal-container.error {
		border: 1px solid red;
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
