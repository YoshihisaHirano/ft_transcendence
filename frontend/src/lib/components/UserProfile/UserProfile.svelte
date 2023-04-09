<script lang="ts">
	import type { Chat, NewChat, User } from '$lib/types/types';
	import Link from '$lib/components/Link/Link.svelte';
	import ProfilePicture from './ProfilePicture.svelte';
	import GameBoard from './GameBoard.svelte';
	import FriendsBoard from './FriendsBoard.svelte';
	import { appState } from '$lib/store/appState';
	import Button from '../Button/Button.svelte';
	import userService from '$lib/services/userService';
	import chatService from '$lib/services/chatService';
	import { chatState, selectedChatId } from '$lib/store/chatState';
	import { goto } from '$app/navigation';
	import { updateUser } from '$lib/utils/updates';

	export let userData: User, isCurrentUser: boolean;
	$: ({ id, username, image, tournamentStats, matchHistory, friends } = userData);
	const userId = $appState?.user?.id || '';

	$: isFriend = false;
	$: if (!isCurrentUser) {
		if ($appState?.user?.friends) {
			isFriend = $appState.user.friends.findIndex((item) => item.id === id) != -1;
		}
	}

	async function befriend() {
		await userService.toggleFriendship(userId, id, true);
		friends = [
			...friends,
			{ id: userId, isOnline: true, username: $appState?.user?.username || '' }
		];
		await updateUser(userId);
		isFriend = true;
	}

	async function unfriend() {
		await userService.toggleFriendship(userId, id, false);
		friends = friends.filter((item) => item.id !== userId);
		await updateUser(userId);
		isFriend = false;
	}

	async function startConversation() {
		const directChat: Chat | null = await chatService.findDirectChat(userId, id);
		if (!directChat) {
			const newChat: NewChat = {
				isDirect: true,
				adminId: userId,
				privacyMode: 'private',
				members: [userId, id],
				chatname: `${username} + ${$appState?.user?.username || ''}`
			}
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
</script>

<div class="user-profile-container">
	<div class="user-profile-info">
		<ProfilePicture imageSrc={image} {isCurrentUser} />
		<p>{username}</p>
		<p>{tournamentStats.ladderLevel} place</p>
		{#if !isCurrentUser}
			{#if isFriend}
				<Button className="friendship-btn" variant="danger" onClick={unfriend}>Unfriend</Button>
			{:else}
				<Button className="friendship-btn" variant="success" onClick={befriend}>Befriend</Button>
			{/if}
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
		{:else}
			<Button className="dm-button" variant="chat" onClick={startConversation}
				>Start DM conversation</Button
			>
		{/if}
		<FriendsBoard {friends} currentId={$appState?.user?.id || id} />
	</div>
</div>

<style>
	:global(.dm-button) {
		display: block;
		padding: 0.75rem 0.5rem;
		color: var(--text-primary);
	}

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
