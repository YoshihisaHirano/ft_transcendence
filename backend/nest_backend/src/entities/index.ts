import { User } from './user.entity';
import { Stats } from './stats.entity';
import { Tournament } from './tournament.entity';
import { Message } from './message.entity';
import { Chat } from './chat.entity';
import { Mute } from './mute.entity';

const entities = [User, Stats, Tournament, Chat, Message, Mute];

export { User, Stats, Tournament, Chat, Message, Mute };
export default entities;
