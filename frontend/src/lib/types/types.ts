export interface AppState {
    isLoggedIn: boolean;
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