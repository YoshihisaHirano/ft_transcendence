export type PrivacyMode = 'public' | 'private' | 'protected';

export interface AppState {
	user: User | null;
}

export type GameStatus = 'matchmaking' | 'waiting' | 'in progress' | 'finished' | 'failed';
export type UserStatus = 'online' | 'offline' | 'game';
export type UserAchievement = 'none' | 'beginner' | 'experienced' | 'master';

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

export type GameMode = 'easy' | 'default' | 'hard';

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
	achievement: UserAchievement;
	gameMode: GameMode;
	login: string;
	twoFactorAuthIsEnabled: boolean;
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
	banList: ShortUser[];
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

export interface BallPosition {
	x: number;
	y: number;
	xspeed: number;
	yspeed: number;
}

export interface GameSettings {
	bgCol: string;
	paddleLength: number;
	ballSize: number;
}

export interface GameInvite {
	gameId: string;
	playerId: string;
	mode: GameMode;
}

export interface GameData {
	gameId: string;
	playerId: string;
	hostName: string;
	playerName: string;
	gameMode: GameMode;
}
