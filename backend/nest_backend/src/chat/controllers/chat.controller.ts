import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ChatService } from 'src/chat/services/chat.service';
import { CreateChatDto } from 'src/dtos/createChat.dto';
import { UpdateChatDto } from 'src/dtos/updateChat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @Post('create')
  createChat(@Body() createChatDto: CreateChatDto) {
    return this.chatService.createChat(createChatDto);
  }
  @Get('all')
  getAllChats() {
    return this.chatService.getAllChats();
  }
  @Get('userid/:id')
  getChatsByUserId(@Param('id') userId: string) {
    return this.chatService.getChatsWhereUserIsMember(userId);
  }
  @Put('addmembers')
  addUserToChat(
    @Body('usersId') usersId: string[],
    @Body('chatId') chatId: string,
  ) {
    return this.chatService.addUsersToChat(usersId, chatId);
  }
  @Put('deletemember')
  deleteUserOfChat(
    @Body('userId') userId: string,
    @Body('chatId') chatId: string,
  ) {
    return this.chatService.deleteUserOfChat(userId, chatId);
  }
  @Post('checkpassword')
  checkPassword(
    @Body('chatId') chatId: string,
    @Body('password') password: string,
  ) {
    return this.chatService.checkPassword(chatId, password);
  }
  @Put('settings')
  changeSettings(@Body() updateChatDto: UpdateChatDto) {
    return this.chatService.updateSettings(updateChatDto);
  }
  @Put('mute')
  muteUser(@Body('chatId') chatId: string, @Body('userId') userId: string) {
    return this.chatService.muteUser(chatId, userId);
  }
  @Put('unmute')
  unmuteUser(@Body('chatId') chatId: string, @Body('userId') userId: string) {
    return this.chatService.unmuteUser(chatId, userId);
  }
  @Get('ismuted/:chatId/:userId')
  checkIfUserInMute(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
  ) {
    return this.chatService.checkMute(chatId, userId);
  }
  @Get('direct/:userOneId/:userTwoId')
  getDirectChat(
    @Param('userOneId') userOneId: string,
    @Param('userTwoId') userTwoId: string,
  ) {
    return this.chatService.findDirectChat(userOneId, userTwoId);
  }
}
