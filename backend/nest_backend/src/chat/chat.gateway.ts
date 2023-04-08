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

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    credentials: true,
    origin: 'http://127.0.0.1:5501',
    methods: ['GET', 'POST'],
    transports: ['websocket'],
  },
})

export class ChatGateway {
	
  	constructor(private chatService: ChatService, private messageService: MessageService) {
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
		console.log(this.users);
		if (this.chatService.isUserChatMember(data.chatId, data.userId) ) {
			if (this.users.has(data.userId) == false) {
				this.users.set(data.userId, client.id);
			}
			const messages = await this.messageService.findChatMessages(data.chatId);
			client.join(data.chatId);
			client.emit("joinChatStatus", messages);
		} else {
			client.emit("joinChatStatus", null);
		}
	}

  @SubscribeMessage('leaveChat')
  handleLeaveRoom(client: Socket, data: UserChangeChatStatus) {
	try {
		this.chatService.deleteUserOfChat(data.userId, data.chatId);
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
		await this.messageService.createMessage(data);
		this.server.to(data.chatId).emit('newMessage', data);
	}
	catch (e) {
		client.emit('newMessage', null);
	}
  }

  @SubscribeMessage('kickUser')
  handleKickUser(admin: Socket, data) {
	try {
		const userToKick = this.server.sockets.get(data.userId);
		this.chatService.deleteUserOfChat(data.userId, data.chatId);
		if (userToKick) {
			userToKick.leave(data.chatId);
			userToKick.emit("noOneLovesYou", data.chatId);
		}
	} catch (e) {
		console.log(e);
	}
  }
  
  @SubscribeMessage('banUser')
  handleBanUser(admin: Socket, data) {
	try {
		const userToKick = this.server.sockets.get(data.userId);

		this.chatService.deleteUserOfChat(data.userId, data.chatId);
		// service ban here
		if (userToKick) {
			userToKick.leave(data.chatId);
			userToKick.emit("noOneLovesYou", data.chatId);
		}
	} catch (e) {
		console.log(e);
	}
  }

}
