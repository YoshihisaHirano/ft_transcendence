<script>
	import UserProfile from "$lib/components/UserProfile/UserProfile.svelte";
    import {secondUser} from '$lib/mockData/mockData';
</script>

<UserProfile isLoggedIn={false} userData={secondUser}/>