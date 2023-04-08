import { PrivacyMode } from 'src/entities/chat.entity';
import { ShortResponseUserDto } from './shortResponseUser.dto';
export class ResponseChatDto {
  chatId: string;
  chatname: string;
  members: ShortResponseUserDto[];
  adminId: string;
  privacyMode: PrivacyMode;
  isDirect: boolean;
}
