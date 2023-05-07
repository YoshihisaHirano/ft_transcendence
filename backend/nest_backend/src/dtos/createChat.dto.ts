import { IsEnum, IsString } from 'class-validator';
import { PrivacyMode } from 'src/entities/chat.entity';

export class CreateChatDto {
  @IsString()
  chatname: string;
  members: string[];
  ownerId: string;
  @IsEnum(PrivacyMode)
  privacyMode: PrivacyMode;
  password: string;
  isDirect: boolean;
}
