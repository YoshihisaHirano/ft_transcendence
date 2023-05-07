import { IsString } from "class-validator";

export class CreateUserDto {
  image: string;
  @IsString()
  username: string;
  login: string;
}
