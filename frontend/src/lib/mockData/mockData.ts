import type { GameStats, User } from '$lib/types/types';

export const matchHistory: GameStats[] = [
	{
		userOneId: '7hf57brwyu45',
		userOneName: 'aalannys',
		userOneScore: 5,
		userTwoId: 'ggrd476yhgv',
		userTwoName: 'kitten',
		userTwoScore: 2
	},
	{
		userOneId: '7hf57brwyu45',
		userOneName: 'aalannys',
		userOneScore: 7,
		userTwoId: 'h53g2ghegv',
		userTwoName: 'unicorn',
		userTwoScore: 10
	},
	{
		userOneId: '7hf57brwyu45',
		userOneName: 'aalannys',
		userOneScore: 5,
		userTwoId: 'ggrd476yhgv',
		userTwoName: 'kitten',
		userTwoScore: 2
	},
	{
		userOneId: '7hf57brwyu45',
		userOneName: 'aalannys',
		userOneScore: 7,
		userTwoId: 'h53g2ghegv',
		userTwoName: 'unicorn',
		userTwoScore: 10
	},
	{
		userOneId: '7hf57brwyu45',
		userOneName: 'aalannys',
		userOneScore: 5,
		userTwoId: 'ggrd476yhgv',
		userTwoName: 'kitten',
		userTwoScore: 2
	},
	{
		userOneId: '7hf57brwyu45',
		userOneName: 'aalannys',
		userOneScore: 7,
		userTwoId: 'h53g2ghegv',
		userTwoName: 'unicorn',
		userTwoScore: 10
	},
	{
		userOneId: '7hf57brwyu45',
		userOneName: 'aalannys',
		userOneScore: 5,
		userTwoId: 'ggrd476yhgv',
		userTwoName: 'kitten',
		userTwoScore: 2
	},
	{
		userOneId: '7hf57brwyu45',
		userOneName: 'aalannys',
		userOneScore: 7,
		userTwoId: 'h53g2ghegv',
		userTwoName: 'unicorn',
		userTwoScore: 10
	},
	{
		userOneId: '7hf57brwyu45',
		userOneName: 'aalannys',
		userOneScore: 5,
		userTwoId: 'ggrd476yhgv',
		userTwoName: 'kitten',
		userTwoScore: 2
	},
	{
		userOneId: '7hf57brwyu45',
		userOneName: 'aalannys',
		userOneScore: 7,
		userTwoId: 'h53g2ghegv',
		userTwoName: 'unicorn',
		userTwoScore: 10
	}
];

export const secondUser: User = {
	id: 'ggrd476yhgv',
	profileImg: '',
	isOnline: false,
	username: 'kitten',
	ladderLevel: 5,
	wins: 6,
	loses: 8,
	friends: [],
	matchHistory: []
};

export const thirdUser: User = {
	id: 'h53g2ghegv',
	profileImg: '',
	isOnline: true,
	username: 'unicorn',
	ladderLevel: 3,
	wins: 9,
	loses: 11,
	friends: [secondUser],
	matchHistory: []
};

export const mainUser: User = {
	id: '7hf57brwyu45',
	profileImg: '',
	isOnline: true,
	username: 'aalannys',
	ladderLevel: 1,
	wins: 20,
	loses: 5,
	friends: [secondUser, thirdUser],
	matchHistory: matchHistory
};

export const userCredentials = {
	login: 'login',
	password: 'password',
};

export const userDb = [mainUser, secondUser, thirdUser];
