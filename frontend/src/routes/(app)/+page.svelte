<script>
	import UserProfile from "$lib/components/UserProfile/UserProfile.svelte";
    import {mainUser} from '$lib/mockData/mockData';
</script>

<UserProfile isLoggedIn userData={mainUser}/>