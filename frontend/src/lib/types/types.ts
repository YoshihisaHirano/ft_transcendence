export type PrivacyMode = 'public' | 'private' | 'protected';

type GameStatus = 'waiting' | 'in progress' | 'finished';

export interface GameState {
	status: GameStatus;
	stats: GameStats;
}

export interface AppState {
	isLoggedIn: boolean;
	user: User | null;
}

export interface GameStats {
	userOneId: string;
	userOneName: string;
	userOneScore: number;
	userTwoId: string;
	userTwoName: string;
	userTwoScore: number;
}

export interface Tournament {
	wins: number;
	losses: number;
	username: string;
	playerId: string;
}

export interface User {
	id: string;
	image: string;
	username: string;
	isOnline: boolean;
	friends: User[];
	tournamentStats: {
		wins: number;
		losses: number;
		ladderLevel: number;
	};
	matchHistory: GameStats[];
}

export interface Message {
    text: string;
    author: string;
    authorId: string;
    chatId: string;
}

export interface Chat {
    chatId: string; // equal to roomId
    chatname: string;
    members: User[];
    messages: Message[];
    adminId: string;
    privacyMode: PrivacyMode,
    password?: string;
}

export interface NewChat {
    chatname: string;
    members: string[];
    privacyMode: PrivacyMode;
    password?: string;
    adminId?: string;
}

export interface ChatSettings {
    chatId: string;
    chatname: string;
    privacyMode: PrivacyMode;
    password?: string;
    adminId: string;
}

export interface NewUser {
	login: string;
	username: string;
	image: string;
}
