<script lang="ts">
	import Portal from 'svelte-portal';
	export let onClose: () => void,
		title = '',
		showCloseBtn = true;
</script>

<Portal>
	<div class="modal-wrapper">
		<div class="modal simple-shadow">
			<h2 class="modal-title">{title}</h2>
			{#if showCloseBtn}
				<button class="modal-close" on:click={onClose}>✖</button>
			{/if}
			<slot />
		</div>
	</div>
</Portal>

<style>
	.modal-wrapper {
		position: absolute;
		height: 100vh;
		max-height: 100vh;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.9);
		z-index: 3;
	}

	.modal {
		position: relative;
		padding: 1.5rem;
		background: var(--background-primary);
		width: 75vw;
		top: 50%;
		transform: translate(0%, -50%);
		max-height: 95vh;
		overflow-y: auto;
	}

	.modal-close {
		color: var(--text-primary);
		position: absolute;
		right: 8px;
		top: 8px;
		background: transparent;
		border: none;
		cursor: pointer;
	}

	.modal-title {
		font-size: 1.05rem;
		margin-bottom: 24px;
	}
</style>
