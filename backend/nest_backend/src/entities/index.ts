import { User } from './user.entity';
import { Stats } from './stats.entity';
import { Tournament } from './tournament.entity';
import { Message } from './message.entity';
import { Chat } from './chat.entity';

const entities = [User, Stats, Tournament, Chat, Message];

export { User, Stats, Tournament, Chat, Message };
export default entities;
