import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CreateChatDto } from 'src/dtos/createChat.dto';
// import { Chat, CreateChatStatus, JoinChatData, JoinChatStatus, LeaveChatData, Message } from "src/types/types";
import { ChatService } from './services/chat.service';

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
  constructor(private chatService: ChatService) {}
  
	@SubscribeMessage('newChat')
	async handleNewChat(client: Socket, newChatData: CreateChatDto) {
		console.log(newChatData);
		try {
			const chat = await this.chatService.createChat(newChatData);
			console.log(chat);
			// join to room admin
			client.emit('newChatCreateStatus', chat);
		} catch (e)
		{
			console.log(e);
			client.emit('newChatCreateStatus', null);
		}
	}
	}

	@SubscribeMessage('joinChat')
	async handleJoinRoom(client: Socket, data) {
		// if (this.chatService.checkUserInChat(data.userId)) {
		if (true) {
			// await const messages = this.chatService.getMessages(data.chatId);
			const messages = [{
				id: "123",
				text: "hello world",
				authorUsername: "Navalny",
				authorId: data.userId,
				chatId: data.chatId,
				createdDate: "12 12 3213 1"
			}];
			client.join(data.chatId);
			client.emit("joinChatStatus", messages);
		} else {
			client.emit("joinChatStatus", null);
		}

  // @SubscribeMessage('leaveChat')
  // handleLeaveRoom(client: Socket, data: LeaveChatData) {
  // 	const leftChatData = new LeaveChatData();
  // 	leftChatData.userId = data.userId;
  // 	leftChatData.chatName = data.chatName;
  // 	leftChatData.chatId = data.chatId;

  // 	const leftChatStatus = this.chatService.leaveChat(leftChatData);
  // 	if (leftChatStatus.status == true) {
  // 		client.leave(leftChatData.chatId);
  // 	}
  // 	client.emit('leaveChatStatus', leftChatStatus);
  // }

  // @SubscribeMessage('userConnect')
  // handleUserConnect(client: Socket, data: {userName: string, id: string}) {
  // 	if (data) {
  // 		client.emit('connected', this.chatService.getAllChats());
  // 	}

  // }

  // @SubscribeMessage('newMessage')
  // handleMessage(client: Socket, data: Message): void {
  // 	const message = new Message(
  // 		data.authorId, data.authorName, data.text, data.chatId
  // 	);
  // 	const messageStatus = this.chatService.receiveMessage(message);
  // 	if (messageStatus.status) {
  // 		this.server.to(data.chatId).emit('newMessage', message);
  // 	}
  // 	client.emit("newMessageStatus", messageStatus);
  // }

  // update settups
  //
}
