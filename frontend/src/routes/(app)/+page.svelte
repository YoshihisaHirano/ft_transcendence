<script lang="ts">
	/** @type {import('./$types').PageData} */
	import { goto } from "$app/navigation";
	import UserProfile from "$lib/components/UserProfile/UserProfile.svelte";
	import type { PageData } from "./$types";
    export let data: PageData;
    $: userData = data.data;

    if (userData && !userData.success) {
        goto('/404');
    }
</script>

{#if userData.user}
    <UserProfile isCurrentUser userData={userData.user}/>
{/if}