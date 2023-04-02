<script lang="ts">
	import type { User } from '$lib/types/types';
	import Link from '$lib/components/Link/Link.svelte';
	import ProfilePicture from './ProfilePicture.svelte';
	import GameBoard from './GameBoard.svelte';
	import FriendsBoard from './FriendsBoard.svelte';
	import { appState } from '$lib/store/appState';
	import Button from '../Button/Button.svelte';
	import userService from '$lib/services/userService';

	export let userData: User, isCurrentUser: boolean;
	$: ({ id, username, image, tournamentStats, matchHistory, friends } = userData);

	$: isFriend = false;
	$: if (!isCurrentUser) {
		if ($appState?.user?.friends) {
			isFriend = $appState.user.friends.findIndex((item) => item.id === id) != -1;
		}
	}

	async function toggleFriendship() {
		const userId = $appState?.user?.id || '';
		if (!isFriend) {
			await userService.toggleFriendship(userId, id, true);
		} else {
			await userService.toggleFriendship(userId, id, false);
		}
	}
</script>

<div class="user-profile-container">
	<div class="user-profile-info">
		<ProfilePicture imageSrc={image} {isCurrentUser} />
		<p>{username}</p>
		<p>{tournamentStats.ladderLevel} place</p>
		{#if !isCurrentUser}
			<Button className="friendship-btn" variant={isFriend ? "danger" : "success"} onClick={toggleFriendship}>
				{isFriend ? "Unfriend" : "Befriend"}
			</Button>
		{/if}
	</div>
	<div class="user-profile-games">
		<GameBoard
			wins={tournamentStats.wins}
			loses={tournamentStats.losses}
			{matchHistory}
			currentId={id}
		/>
		{#if isCurrentUser}
			<Link internal target="/game" bg="#0001FC">Fancy a game?</Link>
		{/if}
	</div>
	<div class="user-profile-friends">
		{#if isCurrentUser}
			<Link internal target="/chatrooms" bg="#DB55DD">Chat with friends</Link>
		{/if}
		<FriendsBoard {friends} currentId={$appState?.user?.id || id} />
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

	:global(.friendship-btn) {
		margin-top: 1.5rem;	
	}
</style>
