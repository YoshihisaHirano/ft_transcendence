<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button/Button.svelte';
	import dino from '$lib/images/dino.svg';
	import { mainUser, userCredentials } from '$lib/mockData/mockData';
	import { appState } from '$lib/store/appState';
	import { saveToStorage } from '$lib/utils/storage';
	import { beforeUpdate } from 'svelte';

	$: credentials = {
		login: '',
		password: ''
	};

	$: loginFailed = false;

	async function login() {
		/* credentials will be checked by backend */
		if (
			credentials.login !== userCredentials.login ||
			credentials.password !== userCredentials.password
		) {
			loginFailed = true;
			return;
		}
        /* if credentials are correct, the user data will be sent */
        const user = mainUser;
		appState.update((prevState) => {
			return { ...prevState, isLoggedIn: true, user: user };
		});
		saveToStorage('userId', user.id);
		goto('/');
	}

	beforeUpdate(() => {
		if ($appState.isLoggedIn) {
			goto('/');
		}
	});
</script>

<main>
	<fieldset>
		{#if loginFailed}
			<legend>Invalid credentials!</legend>
		{/if}
		<img src={dino} alt="" />
		<label for="login">
			Login
			<input id="login" type="text" bind:value={credentials.login} class:failed={loginFailed} />
		</label>
		<label for="password">
			Password
			<input
				id="password"
				type="password"
				bind:value={credentials.password}
				class:failed={loginFailed}
			/>
		</label>
		<Button variant="success" onClick={login}>Let me in</Button>
	</fieldset>
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

	label {
		display: block;
		color: var(--text-primary);
		text-align: end;
		width: 31rem;
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

	input.failed {
		border: 0.15rem solid #df0024;
	}
</style>
