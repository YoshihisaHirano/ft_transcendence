export class WaitingGame {
	playerId: string;
	socketId: string;
	gameMode: string;

	constructor(pId, mode, sId) {
		this.playerId = pId;
		this.socketId = sId;
		this.gameMode = mode;
	}
}