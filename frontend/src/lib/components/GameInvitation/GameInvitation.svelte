<script lang="ts">
	import Button from "../Button/Button.svelte";
	import Modal from "../Modal/Modal.svelte";

	export let disabled: boolean,
		playerId: string,
        playerName: string,
		className = '';

    $: isInviteModalOpen = false;

    function sendGameInvitation() {
        isInviteModalOpen = true;
    }

    function cancelInvitation() {
        isInviteModalOpen = false;
    }

</script>

<button class={className} title="Invite to a game" id="invite-{playerId}" {disabled}> 🏓 </button>

{#if isInviteModalOpen}
    <Modal title="Game invitation for {playerName}" onClose={cancelInvitation}>
        Waiting for their respond...
        <Button variant="danger" onClick={cancelInvitation}>Cancel invitation</Button>
    </Modal>
{/if}

<style>
	button {
		background: transparent;
		cursor: pointer;
		margin: 0;
		outline: none;
		border: none;
		color: var(--text-primary);
	}

	button:disabled {
		filter: grayscale(0.7);
		opacity: 0.8;
		cursor: not-allowed;
	}
</style>
