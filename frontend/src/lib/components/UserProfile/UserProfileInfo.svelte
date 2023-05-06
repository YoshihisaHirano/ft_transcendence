<script lang="ts">
	import userService from '$lib/services/userService';
	import { appState } from '$lib/store/appState';
	import type { User } from '$lib/types/types';
	import { updateUser } from '$lib/utils/updates';
	import Button from '../Button/Button.svelte';
	import TwoFactorAuthModal from '../TwoFactorAuthModal/TwoFactorAuthModal.svelte';
	import ProfilePicture from './ProfilePicture.svelte';
	import StarsAchievement from './StarsAchievement.svelte';

	export let user: User, userId: string, isCurrentUser: boolean;
	$: ({
		id,
		username,
		image,
		tournamentStats,
		friends,
		status,
		achievement,
		twoFactorAuthIsEnabled,
		login
	} = user);

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

	$: twoFactorModalOpen = false;

	function toggle2FaModal() {
		twoFactorModalOpen = !twoFactorModalOpen;
	}

	$: twoFactorAuthAction = $appState.user?.twoFactorAuthIsEnabled
		? 'disable'
		: ('enable' as 'enable' | 'disable');

	function handle2Fa() {
		twoFactorModalOpen = true;
	}
</script>

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

{#if twoFactorModalOpen}
	<TwoFactorAuthModal action={twoFactorAuthAction} {login} onClose={toggle2FaModal} />
{/if}

<style>
	.two-factor-auth {
		margin-top: 0.75rem;
		cursor: pointer;
	}

	.two-factor-auth.enabled {
		background-color: #90ee90;
	}

	.user-profile-info {
		flex-basis: 24%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
