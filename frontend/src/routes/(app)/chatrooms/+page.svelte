<script lang="ts">
	import Chatroom from "$lib/components/Chatroom/Chatroom.svelte";
	import { chatIo } from "$lib/sockets/chatSocket";
	import { statusIo } from "$lib/sockets/statusSocket";
	import { appState } from "$lib/store/appState";
	import type { StatusUpdate } from "$lib/types/types";
	import { updateChats } from "$lib/utils/updates";
	import { onMount } from "svelte";

	onMount(() => {
		const userId = $appState.user?.id;
		chatIo.on('updateChat', async () => {
			if (userId) {
				await updateChats(userId);
			}
		})

		statusIo.on('usersStatusUpdate', async (data: StatusUpdate) => {
			if (userId) {
				await updateChats(userId);
			}
		})

		return () => {
			chatIo.off('updateChat');
			statusIo.off('usersStatusUpdate');
		}
	})
</script>

<Chatroom />
