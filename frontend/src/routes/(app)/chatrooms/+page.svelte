<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte';
	import ProgressBar from '$lib/components/ProgressBar/ProgressBar.svelte';
	import AuthLayout from '$lib/components/AuthLayout/AuthLayout.svelte';
</script>

<AuthLayout>
	<h1>about</h1>
	<p>this is the about page.</p>
	<Button variant="success" onClick={() => console.log('hi')}>Welcome</Button>
	<br />
	<ProgressBar />
</AuthLayout>
