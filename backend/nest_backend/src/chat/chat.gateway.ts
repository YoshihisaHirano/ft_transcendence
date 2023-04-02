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
		origin: "http://localhost:5176",
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


	// @SubscribeMessage('newChat') 
	// async handleNewChat(client: Socket, newChatData: CreateChatDto) {
	// 	console.log(newChatData);
	// 	try {
	// 		const chat = await this.chatService.createChat(newChatData);
	// 		client.emit('newChatCreateStatus', chat);
	// 	} catch (e)
	// 	{
	// 		console.log(e);
	// 		client.emit('newChatCreateStatus', null);
	// 	}
	// }

	@SubscribeMessage('joinChat')
	async handleJoinRoom(client: Socket, data: UserChangeChatStatus) {
		if (this.chatService.isUserChatMember(data.chatId, data.userId) ) {
			this.users.set(data.userId, client.id);
			const messages = await this.messageService.findChatMessages(data.chatId);
			client.join(data.chatId);
			client.emit("joinChatStatus", messages);
		} else {
			client.emit("joinChatStatus", null);
		}
	}

  @SubscribeMessage('leaveChat')
  async handleLeaveRoom(client: Socket, data: UserChangeChatStatus) {
	try {
		await this.chatService.deleteUserOfChat(data.userId, data.chatId);
		client.leave(data.chatId);
		client.emit('leaveChatStatus', data.chatId);
	} catch (e) {
		console.log(e);
		client.emit('leaveChatStatus', null);
	}
  }

  @SubscribeMessage('newMessage')
  async handleMessage(client: Socket, data: CreateMessageDto) {
	try {
		if (await this.muteService.isInMuteList(data.authorId, data.chatId)) {
			client.emit("stillInMute", null);
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
	try {
		const userToKick = this.server.sockets.get(data.userId);
		const chat = this.chatService.findById(data.chatId);
		await this.chatService.deleteUserOfChat(data.userId, data.chatId);
		if (userToKick) {
			userToKick.leave(data.chatId);
			userToKick.emit("youKicked", chat);
		}
	} catch (e) {
		console.log(e);
	}
  }
  
  @SubscribeMessage('banUser')
  async handleBanUser(admin: Socket, data: UserChangeChatStatus) {
	try {
		const userToBan = this.server.sockets.get(data.userId);
		const chat = this.chatService.findById(data.chatId);

		await this.chatService.deleteUserOfChat(data.userId, data.chatId);
		await this.chatService.banUser(data.chatId, data.userId);
		if (userToBan) {
			userToBan.leave(data.chatId);
			userToBan.emit("youBanned", chat);
		}
	} catch (e) {
		console.log(e);
	}
  }

  @SubscribeMessage('muteUser')
  async handleMuteUser(admin: Socket, data: UserChangeChatStatus) {
	try {
		// const userToKick = this.server.sockets.get(data.userId);
		await this.muteService.addToMuteList(data.userId, data.chatId);
	} catch (e) {
		console.log(e);
	}
  }
}
