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

  @WebSocketServer()
  server;

  /*@SubscribeMessage('newChat')
  async handleNewChat(client: Socket, newChatData: CreateChatDto) {
    console.log(newChatData);
    try {
      const chat = await this.chatService.createChat(newChatData);
      client.emit('newChatCreateStatus', chat); // change to chatId??
    } catch (e) {
      client.emit('newChatCreateStatus', null);
    }
  }*/

  // @SubscribeMessage('joinChat')
  // handleJoinRoom(client: Socket, data: JoinChatData) {
  //   const joinData = new JoinChatData();
  //   joinData.chatId = data.chatId;
  //   joinData.userId = data.userId;
  //   joinData.password = data.password;
  //   const joinResult: JoinChatStatus = this.chatService.joinChat(joinData);
  //   if (joinResult.status === true) {
  //     client.join(joinData.chatId); // id
  //   }
  //   client.emit('joinChatStatus', joinResult);
  // }

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
