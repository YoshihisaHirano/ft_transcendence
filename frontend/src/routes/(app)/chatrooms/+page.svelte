<script>
	import Chatroom from "$lib/components/Chatroom/Chatroom.svelte";
	import { chatIo } from "$lib/sockets/chatSocket";
	import { appState } from "$lib/store/appState";
	import { updateChats } from "$lib/utils/updates";
	import { onMount } from "svelte";

	onMount(() => {
		const userId = $appState.user?.id;
		chatIo.on('updateChat', async () => {
			if (userId) {
				await updateChats(userId);
			}
		})

		return () => chatIo.off('updateChat');
	})
</script>

<Chatroom />
