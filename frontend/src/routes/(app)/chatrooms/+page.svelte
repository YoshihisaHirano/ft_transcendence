<script>
	import Chatroom from "$lib/components/Chatroom/Chatroom.svelte";
	import { userChats } from '$lib/mockData/mockData';
</script>

<Chatroom {userChats} />