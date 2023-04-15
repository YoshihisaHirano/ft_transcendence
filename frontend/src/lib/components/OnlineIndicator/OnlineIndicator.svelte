<script lang="ts">
	import type { UserStatus } from "$lib/types/types";

	export let userStatus: UserStatus;
</script>

<span title={`User staus is: ${userStatus}`} class="online-indicator" data-status={userStatus} />

<style>
	.online-indicator {
		display: inline-block;
		height: .85rem;
		width: .85rem;
		border-radius: 50%;
		opacity: 0.8;
		background-color: #996611;
	}

	.online-indicator[data-status="online"] {
		background-color: #43b047;
	}

	.online-indicator[data-status="game"] {
		background-color: #0001fc;
	}
</style>
