import { IsEnum } from 'class-validator';
import { PrivacyMode } from 'src/entities/chat.entity';

export class UpdateChatDto {
  chatId: string;
  chatname: string;
  adminId: string;
  @IsEnum(PrivacyMode)
  privacyMode: PrivacyMode;
  password: string;
}
