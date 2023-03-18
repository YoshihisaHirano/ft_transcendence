<script>
	import Button from '$lib/components/Button/Button.svelte';
	import { appState } from '$lib/store/appState';
	import { removeCookie } from '$lib/utils/storage';
	import { page } from '$app/stores';

	function logout() {
		appState.update((prevState) => {
			return { ...prevState, isLoggedIn: false };
		});
		removeCookie('user-id');
	}

	const navLinks = [
		{ href: '/', text: 'home' },
		{ href: '/chatrooms', text: 'chatrooms' },
		{ href: '/game', text: 'game' },
	];
</script>

<nav class="three-step-shadow">
	<div>
		{#each navLinks as {href, text}}
			<a href={href} class:active={$page.url.pathname === href}>
				<span class="funny-thing">▞</span> {text}
			</a>
		{/each}
	</div>
	<Button onClick={logout} variant="warning" className="header-logout-btn">Log out</Button>
</nav>

<style>
	nav {
		width: calc(100vw - 64px);
		margin-right: 32px;
		margin-left: 32px;
		margin-top: 8px;
		display: flex;
		gap: 4rem;
		padding: 1.25rem 4rem;
		position: fixed;
		top: 8px;
		justify-content: space-between;
		z-index: 1;
		background-color: var(--background-primary);
	}

	:global(nav .header-logout-btn) {
		align-self: flex-end;
		margin: 0 0;
	}

	a,
	a:active,
	a:visited {
		color: var(--text-primary);
		text-decoration: none;
		vertical-align: middle;
		display: inline-block;
		margin-right: 1.65rem;
	}

	.funny-thing {
		display: inline-block;
		vertical-align: super;
	}

	a.active {
		color: #900DFF;
	}

	a.active .funny-thing {
		transform: scale(-1, 1);
	}
</style>
