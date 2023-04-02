<script lang="ts">
    /** @type {import('./$types').PageData} */
	import { goto } from "$app/navigation";
	import UserProfile from "$lib/components/UserProfile/UserProfile.svelte";
	import type { PageData } from "./$types";
    export let data: PageData;

    if (data && !data.success) {
        goto('/404');
    }
</script>

{#if data.user}
    <UserProfile isCurrentUser={false} userData={data.user}/>
{/if}