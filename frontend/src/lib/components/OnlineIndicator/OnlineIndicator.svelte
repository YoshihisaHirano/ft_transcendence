<script lang="ts">
	export let isOnline: boolean;
</script>

<span title={isOnline ? 'online' : 'offline'} class="online-indicator" class:active={isOnline} />

<style>
	.online-indicator {
		display: inline-block;
		height: .85rem;
		width: .85rem;
		border-radius: 50%;
		opacity: 0.8;
		background-color: #996611;
	}

	.online-indicator.active {
		background-color: #43b047;
	}
</style>
