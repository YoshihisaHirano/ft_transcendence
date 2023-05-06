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
	import GameInvitation from '../GameInvitation/GameInvitation.svelte';
	import StarsAchievement from '$lib/components/UserProfile/StarsAchievement.svelte';
	import GameModeBar from '../GameModeBar/GameModeBar.svelte';
	import TwoFactorAuthModal from '../TwoFactorAuthModal/TwoFactorAuthModal.svelte';

	export let userData: User, isCurrentUser: boolean;
	$: ({
		id,
		username,
		image,
		tournamentStats,
		matchHistory,
		friends,
		status,
		achievement,
		twoFactorAuthIsEnabled,
		login
	} = userData);
	const userId = $appState?.user?.id || '';

	$: isFriend = false;
	$: if (!isCurrentUser) {
		if ($appState?.user?.friends) {
			isFriend = $appState.user.friends.findIndex((item) => item.id === id) != -1;
		}
	}

	$: isInBlacklist = false;
	$: if (!isCurrentUser) {
		if ($appState?.user?.blacklist) {
			isInBlacklist = $appState.user.blacklist.findIndex((item) => item === id) != -1;
		}
	}

	$: stars = 0;
	$: switch (achievement) {
		case 'beginner':
			stars = 1;
			break;
		case 'experienced':
			stars = 2;
			break;
		case 'master':
			stars = 3;
			break;
	}

	$: twoFactorModalOpen = false;

	function toggle2FaModal() {
		twoFactorModalOpen = !twoFactorModalOpen;
	}
	
	$: twoFactorAuthAction = $appState.user?.twoFactorAuthIsEnabled ? 'disable' : 'enable'

	function handle2Fa() {
		twoFactorModalOpen = true;
	}

	async function befriend() {
		await userService.toggleFriendship(userId, id, true);
		friends = [
			...friends,
			{
				id: userId,
				status: $appState?.user?.status || 'offline',
				username: $appState?.user?.username || ''
			}
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

	async function addToBlacklist() {
		await userService.toggleBlacklist(userId, id, true);
		await updateUser(userId);
		isInBlacklist = true;
	}

	async function deleteFromBlacklist() {
		await userService.toggleBlacklist(userId, id, false);
		await updateUser(userId);
		isInBlacklist = false;
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
</script>

<div class="user-profile-container">
	<div class="user-profile-info">
		<p>Rank: {achievement}</p>
		<div>
			<StarsAchievement numStars={stars} />
		</div>
		<ProfilePicture imageSrc={image} {isCurrentUser} />
		<p>{username}</p>
		<p>{tournamentStats.ladderLevel} place</p>
		{#if isCurrentUser}
			<button on:click={handle2Fa} class="two-factor-auth {twoFactorAuthIsEnabled && 'enabled'}">
				<p>2FA {twoFactorAuthIsEnabled ? 'enabled' : 'disabled'}</p>
			</button>
		{/if}
		{#if !isCurrentUser}
			{#if isFriend}
				<Button className="friendship-btn" variant="danger" onClick={unfriend}>Unfriend</Button>
			{:else}
				<Button className="friendship-btn" variant="success" onClick={befriend}>Befriend</Button>
			{/if}
		{/if}
		{#if !isCurrentUser}
			{#if isInBlacklist}
				<Button className="blacklist-btn" variant="success" onClick={deleteFromBlacklist}
					>Delete from blacklist</Button
				>
			{:else}
				<Button className="blacklist-btn" variant="danger" onClick={addToBlacklist}
					>Add to blacklist</Button
				>
			{/if}
		{/if}
	</div>
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
		{:else}
			<Button className="dm-button" variant="chat" onClick={startConversation}
				>Start DM conversation</Button
			>
		{/if}
		<FriendsBoard {friends} currentId={$appState?.user?.id || id} />
	</div>
</div>

{#if twoFactorModalOpen}
	<TwoFactorAuthModal action={twoFactorAuthAction} {login} onClose={toggle2FaModal}/>
{/if}

<style>
	:global(.dm-button) {
		display: block;
		padding: 0.75rem 0.5rem;
		color: var(--text-primary);
	}

	.two-factor-auth {
		margin-top: 0.75rem;
		cursor: pointer;
	}

	.two-factor-auth.enabled {
		background-color: #90EE90;
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
