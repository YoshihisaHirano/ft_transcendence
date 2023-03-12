import type { Chat, GameStats, Message, User } from '$lib/types/types';

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

const messages: Message[] = [
	{ author: 'kitten', authorId: 'aaaa', text: 'hello', chatId: 'aafaf' },
	{ author: 'aalannys', authorId: 'aa1aa', text: 'covfefe', chatId: 'aafaf' },
	{ author: 'guest', authorId: 'a2aaa', text: 'how are you', chatId: 'aafaf' },
]

export const userChats: Chat[] = [
	{ adminId: '7hf57brwyu45', chatId: 'gfw2yrw3e', chatname: 'chatty chat', members: [secondUser, mainUser], messages: [], privacyMode: 'public' },
	{ adminId: '7hf57brwyu45', chatId: 'vgqrtfe', chatname: 'kitten chat', members: [secondUser, mainUser, thirdUser], messages: [ ...messages, ...messages ], privacyMode: 'private' },
	{ adminId: 'h53g2ghegv', chatId: 'udq7t7qtr', chatname: 'unicorn chat', members: [mainUser, thirdUser], messages: [messages[2], messages[0]], privacyMode: 'protected' },
]

export const newGroupChat: Chat = {
	chatId: 'sfsgdh',
	adminId: '7hf57brwyu45',
	members: [mainUser],
	chatname: 'LOTR',
	messages: [],
	privacyMode: 'public'
}

export const newDMChat: Chat = {
	chatId: 'dghdhsds',
	adminId: '7hf57brwyu45',
	members: [mainUser, secondUser],
	chatname: 'Kitten chat',
	privacyMode: 'private',
	messages: []
}