<script>
	import Button from '$lib/components/Button/Button.svelte';
	import { appState } from '$lib/store/appState';
	import { removeFromStorage } from '$lib/utils/storage';

	function logout() {
		appState.update((prevState) => {
			return { ...prevState, isLoggedIn: false };
		});
		removeFromStorage('isLoggedIn');
		console.log('logout');
	}
</script>

<nav class="three-step-shadow">
    <div>
        <a href="/">home</a>
        <a href="/chatrooms">chatrooms</a>
        <a href="/game">game</a>
    </div>
	<Button onClick={logout} variant="warning" className="header-logout-btn">
		Log out
	</Button>
</nav>

<style>
	nav {
		width: calc(100vw - 64px);
        margin-right: 32px;
        margin-left: 32px;
        margin-top: 8px;
		display: flex;
		gap: 2rem;
		padding: 1.5rem 4rem;
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
</style>
