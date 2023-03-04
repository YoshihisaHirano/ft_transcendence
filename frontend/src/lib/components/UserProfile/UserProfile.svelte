<script lang="ts">
	import type { User } from '$lib/types/types';
	import Link from '$lib/components/Link/Link.svelte';
	import ProfilePicture from './ProfilePicture.svelte';
	import GameBoard from './GameBoard.svelte';
	import FriendsBoard from './FriendsBoard.svelte';

	export let userData: User, isLoggedIn: boolean;
	let { id, username, profileImg, wins, loses, matchHistory, ladderLevel, friends } = userData;
</script>

<div class="user-profile-container">
	<div class="user-profile-info">
		<ProfilePicture imageSrc={profileImg} {isLoggedIn} />
		<p>{username}</p>
		<p>{ladderLevel} place</p>
	</div>
	<div class="user-profile-games">
		<GameBoard {wins} {loses} {matchHistory} currentId={id} />
		{#if isLoggedIn}
			<Link internal target="/game" bg="#0001FC">Fancy a game?</Link>
		{/if}
	</div>
	<div class="user-profile-friends">
		{#if isLoggedIn}
			<Link internal target="/chatrooms" bg="#DB55DD">Chat with friends</Link>
		{/if}
		<FriendsBoard {friends} currentId={id} />
	</div>
</div>

<style>
	.user-profile-container {
		display: flex;
	}

	.user-profile-info {
		flex-basis: 24%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.user-profile-friends {
		flex-basis: 30%;
	}

	.user-profile-games {
		flex-basis: 50%;
	}
</style>
