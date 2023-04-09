<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte';
	import type { Message } from '$lib/types/types';
	import MessageDisplay from './MessageDisplay.svelte';
	import ControlBar from './ControlBar.svelte';
	import { chatState, selectedChatId } from '$lib/store/chatState';
	import { messagesState } from '$lib/store/messagesState';
	import { chatIo } from '$lib/sockets/websocketConnection';
	import { appState } from '$lib/store/appState';
	import { onMount } from 'svelte';
	import frog from '$lib/images/frog_friend.svg';
	import Notification from '../Notification/Notification.svelte';
	import { updateChats } from '$lib/utils/updates';

	$: reactiveChat = $chatState.find((item) => item.chatId === $selectedChatId) || null;
	$: messageText = '';
	$: isNotificationOpen = false;
	$: notificationText = '';
	$: userId = $appState.user?.id || '';

	function toggleNotification() {
		isNotificationOpen = !isNotificationOpen;
		if (!isNotificationOpen) {
			notificationText = '';
		}
	}

	onMount(() => {
		chatIo.on('newMessage', (data) => {
			const chatId = reactiveChat?.chatId;
			// console.log(data);
			if (chatId) {
				messagesState.update((val) => {
					const chatMsg = val[chatId].slice();
					chatMsg.push(data);
					return {
						...val,
						[data.chatId]: [...chatMsg]
					};
				});
			}
		});

		chatIo.on('youKicked', (data) => {
			const kickedMsg = `You've been kicked from ${data.chatname}`;
			if (!isNotificationOpen) {
				isNotificationOpen = true;
			}
			notificationText += kickedMsg;
			updateChats(userId);
			if ($selectedChatId === data.chatId) {
				selectedChatId.set(null);
			}
		});

		chatIo.on('youBanned', (data) => {
			const bannedMsg = `You've been banned from ${data.chatname}`;
			if (!isNotificationOpen) {
				isNotificationOpen = true;
			}
			notificationText += bannedMsg;
			updateChats(userId);
			if ($selectedChatId === data.chatId) {
				selectedChatId.set(null);
			}
		});

		return () => {
			chatIo.off('newMessage');
			chatIo.off('youKicked');
			chatIo.off('youBanned');
		}
	});

	function sendMessage() {
		const user = $appState.user;
		if (messageText && reactiveChat?.chatId && user) {
			// console.log('send msg', reactiveChat.chatname);
			const newMessage: Message = {
				chatId: reactiveChat.chatId,
				authorUsername: user.username,
				authorId: user.id,
				text: messageText
			};
			messageText = '';
			chatIo.emit('newMessage', newMessage);
		}
	}
</script>

<div class="chat-window simple-shadow">
	{#if $selectedChatId && reactiveChat}
		<ControlBar
			privacyMode={reactiveChat.privacyMode}
			password=""
			adminId={reactiveChat.adminId}
			chatMembers={reactiveChat.members}
			chatname={reactiveChat.chatname}
			chatId={reactiveChat.chatId}
			isDirect={reactiveChat.isDirect}
		/>
		<MessageDisplay />
		<div class="input-area">
			<textarea bind:value={messageText} name="chat-message" id="chat-message" cols="45" rows="2" />
			<Button
				disabled={messageText === ''}
				onClick={sendMessage}
				variant="success"
				className="chat-btn">Send</Button
			>
		</div>
	{:else}
		<div class="fror-wrapper">
			<img src={frog} alt="" width="100px" height="100px" />
		</div>
	{/if}
</div>

{#if isNotificationOpen}
	<Notification onClose={toggleNotification}>
		<p>{notificationText}</p>
	</Notification>
{/if}

<style>
	.chat-window {
		flex: 0 0 75%;
		height: 65vh;
		display: flex;
		flex-direction: column;
	}

	:global(.chat-btn) {
		margin-left: 6px;
		margin-right: 6px;
	}

	.fror-wrapper {
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.fror-wrapper img {
		display: block;
	}

	.input-area {
		display: flex;
		gap: 12px;
		padding: 0.5rem 1rem;
		align-items: center;
		flex-basis: 25%;
		flex-shrink: 0;
	}

	textarea {
		box-sizing: border-box;
		max-width: 85%;
	}
</style>
