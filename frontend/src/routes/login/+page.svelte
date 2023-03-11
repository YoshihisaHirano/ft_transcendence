<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button/Button.svelte';
	import dino from '$lib/images/dino.svg';
	import { appState } from '$lib/store/appState';
	import { saveToStorage } from '$lib/utils/storage';
	import { beforeUpdate } from 'svelte';
	import userService from '$lib/services/userService';
	import UserCreateForm from '$lib/components/UserCreateForm/UserCreateForm.svelte';

	$: loginFailed = false;
	$: renderCreateForm = false;
	$: intraLogin = '';

	async function login() {
		intraLogin = await userService.getIntraLogin() || '';
		if (!intraLogin) {
			loginFailed = true;
			return;
		}
		const user = await userService.getUserByLogin(intraLogin);
		/* if user is not present, the site renders the user create page */
		if (!user) {
			renderCreateForm = true;
			return;
		} else {
			appState.update((prevState) => {
				return { ...prevState, isLoggedIn: true, user: user };
			});
			saveToStorage('userId', user.id);
			goto('/');
		}
	}

	beforeUpdate(() => {
		if ($appState.isLoggedIn) {
			goto('/');
		}
	});
</script>

<main>
	{#if renderCreateForm}
		<UserCreateForm {intraLogin} />
	{:else}
		<fieldset>
			<img src={dino} alt="" />
			{#if loginFailed}
				<legend>Login failed!</legend>
			{/if}
			<Button variant="success" onClick={login}>Login with 42intra</Button>
		</fieldset>
	{/if}
</main>

<style>
	main {
		padding: 8rem 0;
	}

	img {
		position: absolute;
		max-width: 10rem;
		bottom: -3rem;
		left: -4rem;
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
</style>
