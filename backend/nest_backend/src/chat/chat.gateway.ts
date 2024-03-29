import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CreateChatDto } from 'src/dtos/createChat.dto';
import { CreateMessageDto } from 'src/dtos/createMessage.dto';
import { UserChangeChatStatus } from 'src/dtos/UserChangeChatStatus';
// import { Chat, CreateChatStatus, JoinChatData, JoinChatStatus, LeaveChatData, Message } from "src/types/types";
import { ChatService } from './services/chat.service';
import { MessageService } from './services/message.service';
import { MuteService } from './services/mute.service';

@WebSocketGateway({
	namespace: '/chat',
	cors: {
		credentials: true,
		origin: ['http://172.20.0.11:5176', 'http://localhost:5176'],
		methods: ['GET', 'POST'],
	  	transports: ['websocket'],
	}
})

export class ChatGateway {
	
  	constructor(private chatService: ChatService,
		private messageService: MessageService,
		private muteService: MuteService
		) {
		this.users = new Map();
	}
	@WebSocketServer()
	server;

	users;

	updateChat(chatId: string) {
		if (chatId) {
			this.server.to(chatId).emit("updateChat", chatId);
		}
	}

	@SubscribeMessage("updateChat")
	handleUpdateChat(Client: Socket, chatId) {
		this.updateChat(chatId);
	}

	@SubscribeMessage('joinChat')
	async handleJoinRoom(client: Socket, data: UserChangeChatStatus) {
		if (data == null || data.chatId == null || data.userId == null)  {
			// console.log("joinChat on gateway data error: ", data);
			return ;
		}
		try {
			if (this.chatService.isUserChatMember(data.chatId, data.userId) ) {
				this.users.set(data.userId, client.id);
				const messages = await this.messageService.findChatMessages(data.chatId);
				client.join(data.chatId);
				client.emit("joinChatStatus", { chatId: data.chatId, messages});
			} else {
				client.emit("joinChatStatus", null);
			}
		} catch (error) {
			// console.log(error);
		}
	}

  @SubscribeMessage('leaveChat')
  async handleLeaveRoom(client: Socket, data: UserChangeChatStatus) {
	try {
		await this.chatService.deleteUserOfChat(data.userId, data.chatId, true);
		client.leave(data.chatId);
		client.emit('leaveChatStatus', data.chatId);
		this.updateChat(data.chatId);
	} catch (e) {
		client.emit('leaveChatStatus', null);
	}
  }

  @SubscribeMessage('newMessage')
  async handleMessage(client: Socket, data: CreateMessageDto) {
	if (data == null || data.authorId == null || data.authorUsername == null
			|| data.chatId == null || data.text == null) {
		// console.log("newMessage data error on gateway: ", data);
		return ;
	}
	try {
		if (await this.muteService.isInMuteList(data.chatId, data.authorId)) {
			const chat = await this.chatService.findById(data.chatId);
			client.emit("stillInMute", chat);
			return ;
		}
		await this.messageService.createMessage(data);
		this.server.to(data.chatId).emit('newMessage', data);
	}
	catch (e) {
		client.emit('newMessage', null);
	}
  }

  @SubscribeMessage('kickUser')
  async handleKickUser(admin: Socket, data: UserChangeChatStatus) {
	if (data == null || data.chatId  == null || data.userId == null) {
		// console.log("kick user data error on gateway: ", data);
		return;
	}
	try {
		const userToKick = this.server.sockets.get(this.users.get(data.userId));
		const chat = await this.chatService.findById(data.chatId);
		await this.chatService.deleteUserOfChat(data.userId, data.chatId, false);
		if (userToKick) {
			userToKick.leave(data.chatId);
			userToKick.emit("youKicked", chat);
		}
		this.updateChat(data.chatId);
	} catch (e) {
	}
  }
  
  @SubscribeMessage('banUser')
  async handleBanUser(admin: Socket, data: UserChangeChatStatus) {
	if (!data || !data.chatId || !data.userId) {
		// console.log("banUser data error: ", data);
		return 0;
	}
	try {
		const userToBan = this.server.sockets.get(this.users.get(data.userId));
		const chat = await this.chatService.findById(data.chatId);

		await this.chatService.deleteUserOfChat(data.userId, data.chatId, false);
		await this.chatService.banUser(data.chatId, data.userId);
		if (userToBan) {
			userToBan.leave(data.chatId);
			userToBan.emit("youBanned", chat);
		}
		this.updateChat(data.chatId);
	} catch (e) {
	}
  }

  @SubscribeMessage('muteUser')
  async handleMuteUser(admin: Socket, data: UserChangeChatStatus) {
	if (data == null || data.chatId == null || data.userId == null) {
		// console.log("mute user on gateway data error: ", data);
		return ;
	}
	try {
		let res = await this.muteService.addToMuteList(data.chatId, data.userId);
		this.updateChat(data.chatId);
	} catch (e) {
		// console.log(e);
	}
  }
}
