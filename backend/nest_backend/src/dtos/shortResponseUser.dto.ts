import { StatusMode } from 'src/entities/user.entity';

export class ShortResponseUserDto {
  id: string;
  username: string;
  status: StatusMode;
}
