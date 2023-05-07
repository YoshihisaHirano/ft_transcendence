import { IsString } from "class-validator";

export class CreateMessageDto {
  @IsString()
  text: string;
  authorUsername: string;
  authorId: string;
  chatId: string;
}
