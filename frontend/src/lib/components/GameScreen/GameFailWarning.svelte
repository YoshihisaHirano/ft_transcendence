<script>
	export let text = 'Please do not leave or refresh this page! Your game will be lost!'
</script>

<div>{text}</div>

<style>
	div {
		background-color: var(--background-primary);
		color: var(--text-primary);
		padding: 0.5rem 1rem;
        position: absolute;
		top: 0;
		left: 0;
        border: 1px solid red;
        border-radius: 4px;
	}
</style>
