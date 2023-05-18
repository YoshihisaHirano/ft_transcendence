<script lang="ts">
	import defaultPicture from '$lib/images/default_pic.svg';
	import { appState } from '$lib/store/appState';
	import CogIcon from '../CogIcon/CogIcon.svelte';
	import Modal from '../Modal/Modal.svelte';
	import UserUpdateModal from './UserUpdateModal.svelte';
	export let imageSrc: string, isCurrentUser: boolean;

	$: uploadVisible = false;
	$: modalOpen = false;

	function setUploadVisibility(val: boolean) {
		// change to val when allow to change profile pic
		uploadVisible = val;
	}

	function toggleModal() {
		modalOpen = !modalOpen;
	}
</script>

<div
	class="image-frame"
	on:pointerenter={() => setUploadVisibility(true)}
	on:pointerleave={() => setUploadVisibility(false)}
>
	<img src={imageSrc !== 'null' ? imageSrc : defaultPicture} alt="user profile pic" />
	{#if isCurrentUser}
		<div class="upload-picture" class:active={uploadVisible}>
			<button on:click={toggleModal}>
				<CogIcon />
			</button>
		</div>
	{/if}
</div>

{#if modalOpen && $appState.user}
	<Modal onClose={toggleModal} title="Update user info">
		<UserUpdateModal id={$appState.user.id} image={imageSrc} />
	</Modal>
{/if}

<style>
	button {
		background-color: transparent;
		padding: 0;
		margin: 0;
		outline: none;
		border: none;
	}

	.image-frame {
		width: 12rem;
		height: 12rem;
		border: 2px solid white;
		margin-bottom: 8px;
		position: relative;
		overflow: hidden;
	}

	.image-frame img {
		aspect-ratio: 1 / 1;
		max-width: 100%;
		height: auto;
		object-fit: cover;
	}

	.upload-picture {
		position: absolute;
		bottom: 0;
		right: 0;
		left: 0;
		background-color: #2d2c2c;
		z-index: 1;
		padding: 4px 8px;
		display: flex;
		justify-content: end;
		opacity: 0;
		transition: opacity 0.4s ease-in-out;
	}

	.upload-picture.active {
		opacity: 0.9;
	}
</style>
