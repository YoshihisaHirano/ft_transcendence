<script lang="ts">
	import { goto } from '$app/navigation';
	import userService from '$lib/services/userService';
	import { appState } from '$lib/store/appState';
	import { saveToStorage } from '$lib/utils/storage';
	import Button from '../Button/Button.svelte';

	export let intraLogin: string;

	$: newUser = {
        image: 'null',
		login: intraLogin,
		username: '',
	};

	$: errorMsg = '';
	$: floppyFill = '#FFF';

	function resetError() {
		errorMsg = '';
	}

	async function createUser() {
		if (newUser.username) {
			const user = await userService.createUser(newUser);
            if ("message" in user) {
                errorMsg = user.message;
                return;
            }
            appState.update((prevState) => {
				return { ...prevState, isLoggedIn: true, user: user };
			});
			saveToStorage('userId', user.id);
			goto('/');
		}
	}

	function handleImage(e: Event) {
		const reader = new FileReader();
		const target = e.target as HTMLInputElement;
		if (target.files) {
			const uploadedFile = target.files[0];
			if (uploadedFile && uploadedFile.size > 2000000) {
				errorMsg = 'Your filesize should not exceed 2Mb!';
				floppyFill = '#E52521';
				return;
			}
			reader.readAsDataURL(uploadedFile);
			reader.onload = () => {
				resetError();
				floppyFill = '#2CB01A';
				newUser.image = (reader.result || '') as string;
			};
		}
	}

    function handleFocus() {
        errorMsg = '';
    }
</script>

<form>
	<fieldset>
		{#if errorMsg}
			<legend>{errorMsg}</legend>
		{/if}
		<label for="username" class="username">
			<p>username</p>
			<input type="text" id="username" class:failed={errorMsg} bind:value={newUser.username} on:focus={handleFocus} />
		</label>
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
		<Button disabled={errorMsg !== '' || newUser.username === ''} variant="success" onClick={createUser}
			>Sign me up</Button
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
	}
</style>
