import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ChatService } from 'src/chat/services/chat.service';
import { CreateChatDto } from 'src/dtos/createChat.dto';
import { UpdateChatDto } from 'src/dtos/updateChat.dto';
import { UserService } from 'src/user/services/user/user.service';
import { ShortResponseUserDto } from 'src/dtos/shortResponseUser.dto';
import { ResponseChatDto } from 'src/dtos/responseChat.dto';
import { Chat } from 'src/entities';
import { MuteService } from '../services/mute.service';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly muteService: MuteService,
  ) {}
  @Post('create')
  async createChat(
    @Body() createChatDto: CreateChatDto,
  ): Promise<ResponseChatDto> {
    const chat = await this.chatService.createChat(createChatDto);
    const members: ShortResponseUserDto[] =
      await this.userService.getShortInfoByIds(chat.members);
    return {
      chatId: chat.chatId,
      chatname: chat.chatname,
      members: members,
      adminId: chat.adminId,
      privacyMode: chat.privacyMode,
      isDirect: chat.isDirect,
      banList: chat.banList,
    };
  }
  @Get('all')
  getAllChats() {
    return this.chatService.getAllChats();
  }
  @Get('userid/:id')
  async getChatsByUserId(
    @Param('id') userId: string,
  ): Promise<ResponseChatDto[]> {
    const res: ResponseChatDto[] = [];
    const chats: Chat[] = await this.chatService.getChatsWhereUserIsMember(
      userId,
    );
    for (const chat of chats) {
      res.push({
        chatId: chat.chatId,
        chatname: chat.chatname,
        members: await this.userService.getShortInfoByIds(chat.members),
        adminId: chat.adminId,
        privacyMode: chat.privacyMode,
        isDirect: chat.isDirect,
        banList: chat.banList,
      });
    }
    return res;
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
  @Put('ban')
  banUser(@Body('chatId') chatId: string, @Body('userId') userId: string) {
    return this.chatService.banUser(chatId, userId);
  }
  @Put('unban')
  unbanUser(@Body('chatId') chatId: string, @Body('userId') userId: string) {
    return this.chatService.unbanUser(chatId, userId);
  }
  @Get('isbanned/:chatId/:userId')
  checkIfUserBanned(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
  ) {
    return this.chatService.checkBan(chatId, userId);
  }
  @Get('direct/:userOneId/:userTwoId')
  getDirectChat(
    @Param('userOneId') userOneId: string,
    @Param('userTwoId') userTwoId: string,
  ) {
    return this.chatService.findDirectChat(userOneId, userTwoId);
  }
  @Get('member/:chatId/:userId')
  checkUserMembership(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
  ) {
    return this.chatService.isUserChatMember(chatId, userId);
  }
  @Delete('deletechat/:chatId')
  deleteChat(@Param('chatId') chatId: string) {
    return this.chatService.deleteChat(chatId);
  }
  @Get('chatbyid/:id')
  async getChatById(@Param('id') id: string): Promise<ResponseChatDto> {
    const chat = await this.chatService.findById(id);
    const members: ShortResponseUserDto[] =
      await this.userService.getShortInfoByIds(chat.members);
    return {
      chatId: chat.chatId,
      chatname: chat.chatname,
      members: members,
      adminId: chat.adminId,
      privacyMode: chat.privacyMode,
      isDirect: chat.isDirect,
      banList: chat.banList,
    };
  }
  @Post('mute')
  muteUser(@Body('chatId') chatId: string, @Body('userId') userId: string) {
    return this.muteService.addToMuteList(chatId, userId);
  }
  @Delete('unmute')
  unmuteUser(@Body('chatId') chatId: string, @Body('userId') userId: string) {
    return this.muteService.deleteFromMuteList(chatId, userId);
  }
  @Get('ismute/:chatId/:userId')
  checkIsMuted(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
  ) {
    return this.muteService.isInMuteList(chatId, userId);
  }
  // @Get('mutelist')
  // findAllMuted() {
  //   return this.muteService.getAll();
  // }
}
