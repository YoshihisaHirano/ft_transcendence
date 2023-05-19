<script>
	import Link from '$lib/components/Link/Link.svelte';
	import '/src/styles/colors.css'
    import '/src/styles/global.css'
</script>

<svelte:head>
    <title>Ooops, 404</title>
</svelte:head>
<div>
    <p>404</p>
    <p>Good luck next time ;)</p>
    <Link target="/" internal>Back to home</Link>
</div>

<style>
    div {
        padding-top: 3rem;
    }
    p {
        text-align: center;
        font-size: 2.5rem;
        margin-bottom: 2rem;
    }

    p:first-of-type {
        font-size: 7rem;
    }

    p:last-of-type {
        margin-bottom: 4rem;
    }
</style>