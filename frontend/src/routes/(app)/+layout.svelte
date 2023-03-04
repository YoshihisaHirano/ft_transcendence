<script lang="ts">
	import '/src/styles/colors.css';
	import '/src/styles/animations.css';
	import '/src/styles/global.css';
	import Header from '$lib/components/Header/Header.svelte';
	import AuthLayout from '$lib/components/AuthLayout/AuthLayout.svelte';
</script>

<svelte:head>
    <title>FT_Transcendence</title>
</svelte:head>
<AuthLayout>
	<Header />
	<main>
		<slot />
	</main>
</AuthLayout>

<style>
	main {
		padding: 10rem 0 5rem;
		max-width: 95vw;
		margin: 0 auto;
	}
</style>
