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

export interface NewUser {
	login: string;
	username: string;
	image: string;
}
