import { Injectable } from "@nestjs/common";
import { GameInvite } from "src/dtos/GameInvite.dto";


@Injectable()
export class GameService {
	constructor() {
		this.games = new Map();
		this.users = new Map();
		// userid (host): enemy
	}
	games; // [hostId, playerId]
	users;
	
	// fifo; // for mm
	// users here/

	addUser(userId, socketId) {
		this.users.set(userId, socketId);
	}

	removeUser(userId) {
		if (this.users.has(userId)) {
			this.users.delete(userId);
		}
	}

	getUserSocketId(userId) {
		if (this.users.has(userId)) {
			return this.users.get(userId)
		}
		return null;
	}

	getUserIdBySocketId(socketId) {
		for (const [key, value] of this.users.entries()) {
			if (value.localeCompare(socketId) == 0) {
				return key;
			}
		}
		return null;
	}

	isUserGameHost(id) {
		return this.games.has(id);
	}

	getSecondPlayerId(leftUserId) {
		if (this.games.has(leftUserId)) { // host left
			return this.games.get(leftUserId); // return id player
		} else {
			for (const [key, value] of this.games.entries()) {
				if (value.localeCompare(leftUserId) == 0) {
					return key; // return id host
				}
			}
		}
		return null;
	}

	getGameId(leftPlayerId, secondPlayer) {
		if (this.games.has(leftPlayerId)) {
			return leftPlayerId;
		} else if (this.games.has(secondPlayer)) {
			return secondPlayer;
		}
		return null;
	}

	createGame(data: GameInvite) { // for status
		this.games.set(data.gameId, data.playerId);
	}

	deleteGame(gameId) {
		if (this.games.has(gameId)) {
			this.games.delete(gameId);
		}
	}

	async playerJoinGame(data: GameInvite) : Promise<boolean> {
		let count = 0;
		while (this.games.has(data.gameId) == false && count < 5) {
			await this.sleep(10);
			count++;
		}
		if (count == 5) {
			return false;
		}
		return true;
	}

	spectatorJoinGame(userId) {
		return this.games.has(userId);
	}

	sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
}