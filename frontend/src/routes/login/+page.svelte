<script lang="ts">
	import { goto } from '$app/navigation';
	import dino from '$lib/images/dino.svg';
	import { appState } from '$lib/store/appState';
	import { beforeUpdate } from 'svelte';
	import UserCreateForm from '$lib/components/UserCreateForm/UserCreateForm.svelte';
	import { removeFromStorage, saveToStorage } from '$lib/utils/storage';
	import Link from '$lib/components/Link/Link.svelte';
	/** @type {import('./$types').PageData} */

	export let data: {
		userId: string;
		login: string;
		redirectUrl?: string;
	};

	$: loginFailed = false;
	$: renderCreateForm = false;
	$: intraLogin = '';

	beforeUpdate(() => {
		if (data.redirectUrl) {
			return;
		}
		if ($appState.isLoggedIn) {
			goto('/');
		}
		if (data.userId) {
			saveToStorage('userId' ,data.userId);
			appState.update((val) => ({
				...val, isLoggedIn: true
			}));
			goto('/');
		} else {
			intraLogin = data.login;
			renderCreateForm = true;
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
			{#if data.redirectUrl}
				<Link internal={false} target={data.redirectUrl}>LOGIN</Link>
			{/if}
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
