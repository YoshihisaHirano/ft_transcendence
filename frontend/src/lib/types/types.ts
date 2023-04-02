export type PrivacyMode = 'public' | 'private' | 'protected';

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
}

export interface ChatSettings {
    chatId: string;
    chatname: string;
    privacyMode: PrivacyMode;
    password?: string | null;
    adminId: string;
}

export interface MessagesState {
    [chatId: string]: Message[]
}