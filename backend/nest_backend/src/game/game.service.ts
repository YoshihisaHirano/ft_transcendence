import { Injectable } from "@nestjs/common";


@Injectable()
export class GameService {
	constructor() {
		this.games = new Map();
		// userid (host): enemy
	}
	games; // [hostId, playerId]
	fifo; // for mm

	// users here/

	newGame(hostId) {
		this.games.set(hostId, null);
		// console.log(this.games);
	}

	joinGame(hostId, playerId) : boolean {
		if (this.games.has(hostId) === false) {
			return false;
		}
		this.games.set(hostId, playerId);
		// console.log(this.games);

		return true;
	}

	/// disconnect 
	// handleDisconnect()
	/// disconnect 


// 

	// return second player for delete
	endGame(gameId) {
		if (this.games.has(gameId)) {
			const player = this.games.get(gameId);
			this.games.delete(gameId);
			return player;
		}
		return null;
	}
}