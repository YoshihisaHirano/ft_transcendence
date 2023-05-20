<script lang="ts">
	import userService from '$lib/services/userService';
	import { appState } from '$lib/store/appState';
	import Error from '../../../routes/+error.svelte';
	import Button from '../Button/Button.svelte';

	export let id: string, image: string;
	$: updatedUser = {
		image,
		id
	};

	$: errorMsg = '';
	$: floppyFill = '#FFF';

	$: userDataChanged = image !== updatedUser.image;

	function resetError() {
		errorMsg = '';
	}

	async function updateUser() {
		if (userDataChanged && !errorMsg) {
			try {
				const res = await userService.updateUser(updatedUser);
				if (res && 'message' in res) {
					errorMsg = res.message;
					return;
				}
				appState.update((prevState) => {
					if (prevState.user) {
						return {
							...prevState,
							user: { ...prevState.user, image: updatedUser.image }
						};
					}
					return prevState;
				});
			} catch (error) {}
		}
	}

	function handleImage(e: Event) {
		const reader = new FileReader();
		const target = e.target as HTMLInputElement;
		if (target.files) {
			const uploadedFile = target.files[0];
			if (uploadedFile && uploadedFile.size > 350000) {
				errorMsg = 'Your filesize should not exceed 350Kb!';
				floppyFill = '#E52521';
				return;
			}
			try {
				if (uploadedFile instanceof Blob) {
					reader.readAsDataURL(uploadedFile);
					reader.onload = () => {
						resetError();
						floppyFill = '#2CB01A';
						updatedUser.image = (reader.result || '') as string;
					};
				}
			} catch (error) {
				if (error instanceof Error) {
					errorMsg = error.message;
					floppyFill = '#E52521';
				}
			}
		}
	}

	// function handleFocus() {
	// 	errorMsg = '';
	// }
</script>

<form>
	<fieldset>
		{#if errorMsg}
			<legend>{errorMsg}</legend>
		{/if}
		<label for="profile-pic" class="profile-pic">
			<p>profile pic</p>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill={floppyFill}
				width="34px"
				height="34px"
				viewBox="0 0 22 22"
				id="memory-floppy-disk"
				><path
					d="M2 3H3V2H16V3H17V4H18V5H19V6H20V19H19V20H3V19H2V3M18 7H17V6H16V5H15V9H6V4H4V18H6V13H16V18H18V7M11 4V7H13V4H11M14 18V15H8V18H14Z"
				/></svg
			>
			<input
				type="file"
				id="profile-pic"
				accept=".png,.jpg,.jpeg"
				on:change={handleImage}
				class="visually-hidden"
			/>
		</label>
		<Button disabled={errorMsg !== '' || !userDataChanged} variant="success" onClick={updateUser}
			>Update profile picture</Button
		>
	</fieldset>
</form>

<style>
	label {
		display: flex;
		color: var(--text-primary);
		width: 35rem;
		cursor: pointer;
	}

	label.username input {
		display: block;
	}

	input.failed {
		border: 0.15rem solid #df0024;
	}

	label p {
		flex-basis: 35%;
	}

	legend {
		margin-left: 1rem;
		color: #df0024;
	}

	fieldset {
		position: relative;
		width: 85%;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 2rem 0;
		gap: 1rem;
	}

	.profile-pic {
		align-items: center;
		justify-content: center;
	}
</style>
