<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button/Button.svelte';
	import chatService from '$lib/services/chatService';
	import { appState } from '$lib/store/appState';

	export let data: {
		name: string;
	};

	$: error = '';
	$: id = $appState.user?.id || '';
	let password: string;

	async function checkPassword(e: Event) {
		e.preventDefault();
		const chatId = $page.params.slug;
		const isPasswordCoorrect = await chatService.checkChatPassword(password, chatId);
		// console.log(isPasswordCoorrect);
		password = '';
		if (!isPasswordCoorrect) {
			error = 'Wrong password!';
		} else {
			await chatService.addMembers([id], chatId);
			goto('/chatrooms');
		}
	}

	function resetError() {
		error = '';
	}
</script>

{#if data.name}
	<form class="chat-password-form">
		<fieldset>
			{#if error}
				<legend>{error}</legend>
			{/if}
			<label for="chat-password">
				please enter <span class="chatname">{data?.name || "chat's"}</span> password
				<input id="chat-password" type="password" bind:value={password} on:focus={resetError} />
			</label>
			<Button onClick={checkPassword} disabled={!password} variant="danger">Send</Button>
		</fieldset>
	</form>
{/if}

<style>
	fieldset {
		padding: 2rem 1.5rem;
		margin-top: 3rem;
	}

	legend {
		color: #df0024;
	}

	input {
		display: block;
		width: 80%;
		margin: 1rem 0;
	}

	.chat-password-form {
		width: 45%;
		margin: auto;
	}

	.chatname {
		text-transform: uppercase;
	}
</style>
