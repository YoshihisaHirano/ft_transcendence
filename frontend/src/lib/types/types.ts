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
    profileImg: string;
    username: string;
    isOnline: boolean;
    friends: User[];
    wins: number;
    loses: number;
    ladderLevel: number;
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