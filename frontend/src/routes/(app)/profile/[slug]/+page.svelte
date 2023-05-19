<script lang="ts">
	/** @type {import('./$types').PageData} */
	import { goto } from '$app/navigation';
	import UserProfile from '$lib/components/UserProfile/UserProfile.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	$: userData = data;
	import { onMount } from 'svelte';
	import { statusIo } from '$lib/sockets/statusSocket';
	import type { StatusUpdate } from '$lib/types/types';

	if (userData && !userData.success) {
		goto('/404');
	}

	onMount(() => {
		statusIo.on('userStatusUpdate', async (data: StatusUpdate) => {
			if (userData.user) {
				const user = userData.user;
				// // console.log('userStatusUpdate, profile page', data);
				if (user.id === data.userId) {
					user.status = data.status;
				}
				let friends = user.friends;

				if (friends) {
					const friendIdx = friends.findIndex((item) => item.id === data.userId);
					if (friendIdx > -1) {
						friends[friendIdx] = { ...friends[friendIdx], status: data.status };
						friends = [...friends];
						userData.user = { ...userData.user, friends: friends}
					}
				}
			}
		})

		return () => {
			statusIo.off('userStatusUpdate');
		}
	})
</script>

{#if userData.user}
	<UserProfile isCurrentUser={false} userData={userData.user} />
{/if}
