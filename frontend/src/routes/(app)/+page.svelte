<script lang="ts">
	import UserProfile from "$lib/components/UserProfile/UserProfile.svelte";
	import { appState } from "$lib/store/appState";

    $: userData = $appState.user;
</script>

{#if userData}
    <UserProfile isCurrentUser userData={userData}/>
{/if}