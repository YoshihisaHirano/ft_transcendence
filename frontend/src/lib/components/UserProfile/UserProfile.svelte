<script lang="ts">
	import type { Chat, NewChat, StatusUpdate, User } from '$lib/types/types';
	import Link from '$lib/components/Link/Link.svelte';
	import GameBoard from './GameBoard.svelte';
	import FriendsBoard from './FriendsBoard.svelte';
	import { appState } from '$lib/store/appState';
	import Button from '../Button/Button.svelte';
	import chatService from '$lib/services/chatService';
	import { chatState, selectedChatId } from '$lib/store/chatState';
	import { goto } from '$app/navigation';
	import GameInvitation from '../GameInvitation/GameInvitation.svelte';
	import GameModeBar from '../GameModeBar/GameModeBar.svelte';
	import CurrentGames from './CurrentGames.svelte';
	import UserProfileInfo from './UserProfileInfo.svelte';
	import { statusIo } from '$lib/sockets/statusSocket';
	import { onMount } from 'svelte';

	export let userData: User, isCurrentUser: boolean;
	$: ({ id, username, tournamentStats, matchHistory, friends, status } = userData);
	const userId = $appState?.user?.id || '';

	// onMount(() => {
	// 	statusIo.on('userStatusUpdate', (data: StatusUpdate) => {
	// 		if (!isCurrentUser && data.userId === id) {
	// 			status = data.status;
	// 		}
	// 		const friendIdx = friends.findIndex((item) => item.id === data.userId);
	// 		if (friendIdx > -1) {
	// 			friends[friendIdx] = { ...friends[friendIdx], status: data.status };
	// 			friends = [ ...friends ];
	// 		}
	// 	});

	// 	return () => {
	// 		statusIo.off('usersStatusUpdate');
	// 	};
	// });

	async function startConversation() {
		const directChat: Chat | null = await chatService.findDirectChat(userId, id);
		if (!directChat) {
			const newChat: NewChat = {
				isDirect: true,
				ownerId: userId,
				privacyMode: 'private',
				members: [userId, id],
				chatname: `${username} + ${$appState?.user?.username || ''}`
			};
			const createdChat = await chatService.createChat(newChat);
			if (!('message' in createdChat)) {
				const updatedChats = await chatService.getChatsByUserId(userId);
				chatState.set(updatedChats);
				selectedChatId.set(createdChat.chatId);
				goto('/chatrooms');
			}
		} else {
			selectedChatId.set(directChat.chatId);
			goto('/chatrooms');
		}
	}

	$: isInBlacklist = $appState.user?.blacklist.findIndex((item) => item === id) !== -1;
</script>

<div class="user-profile-container">
	<UserProfileInfo {isCurrentUser} user={userData} {userId} />
	<div class="user-profile-games">
		{#if isCurrentUser}
			<GameModeBar {id} />
		{/if}
		<GameBoard
			wins={tournamentStats.wins}
			loses={tournamentStats.losses}
			{matchHistory}
			currentId={id}
		/>
		{#if isCurrentUser}
			<Link internal target="/game" bg="#0001FC">Fancy a game?</Link>
		{/if}
		{#if !isCurrentUser && status == 'online'}
			<div class="game-invitation">
				<p>Invite to a game:</p>
				<GameInvitation className="user-profile-invite-btn" playerId={id} playerName={username} />
			</div>
		{/if}
	</div>
	<div class="user-profile-friends">
		{#if isCurrentUser}
			<Link internal target="/chatrooms" bg="#DB55DD">Chat with friends</Link>
		{:else if !isCurrentUser && !isInBlacklist}
			<Button className="dm-button" variant="chat" onClick={startConversation}
				>Start DM conversation</Button
			>
		{/if}
		<FriendsBoard {friends} currentId={$appState?.user?.id || id} />
		{#if isCurrentUser}
			<CurrentGames />
		{/if}
	</div>
</div>

<style>
	:global(.dm-button) {
		display: block;
		padding: 0.75rem 0.5rem;
		color: var(--text-primary);
	}

	:global(p ~ button.user-profile-invite-btn) {
		border: 1px solid white;
		border-radius: 50%;
		padding: 0.35rem 0.45rem 0.4rem;
	}

	.game-invitation {
		display: flex;
		align-items: center;
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
	}

	.user-profile-container {
		display: flex;
	}

	@media (max-width: 800px) {
		.user-profile-container {
			flex-direction: column;
			gap: 2rem;
		}
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
