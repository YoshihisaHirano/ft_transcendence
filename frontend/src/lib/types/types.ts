export type PrivacyMode = 'public' | 'private' | 'protected';

export interface AppState {
	user: User | null;
}

export type GameStatus = 'matchmaking' | 'waiting' | 'in progress' | 'finished' | 'failed';
export type UserStatus = 'online' | 'offline' | 'game';

export interface GameStats {
	userOneId: string;
	userOneName: string;
	userOneScore: number;
	userTwoId: string;
	userTwoName: string;
	userTwoScore: number;
}
export interface GameState {
	status: GameStatus;
	stats: GameStats;
}

export interface GameInvite {
	gameId: string;
	playerId: string;
}

export interface Tournament {
	wins: number;
	losses: number;
	username: string;
	playerId: string;
}

export interface ShortUser {
	id: string;
	username: string;
	status: UserStatus;
}

export interface User {
	id: string;
	image: string;
	username: string;
	status: UserStatus;
	friends: ShortUser[];
	tournamentStats: {
		wins: number;
		losses: number;
		ladderLevel: number;
	};
	matchHistory: GameStats[];
	blacklist: string[];
}

export interface NewChat {
	chatname: string;
	members: string[];
	privacyMode: PrivacyMode;
	password?: string | null;
	adminId?: string;
	isDirect: boolean;
}

export interface NewUser {
	login: string;
	username: string;
	image: string;
}

export interface Message {
	text: string;
	authorUsername: string;
	authorId: string;
	chatId: string;
}

export interface Chat {
	chatId: string;
	chatname: string;
	members: User[];
	adminId: string;
	privacyMode: PrivacyMode;
	password?: string | null;
	isDirect: boolean;
	muteList: string[];
	banList: string[];
}

export interface ChatSettings {
	chatId: string;
	chatname: string;
	privacyMode: PrivacyMode;
	password?: string | null;
	adminId: string;
}

export interface MessagesState {
	[chatId: string]: Message[];
}

export interface ChatStatusChange {
	userId: string;
	chatId: string;
}
