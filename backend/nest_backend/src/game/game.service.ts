import { Injectable } from "@nestjs/common";
import { GameInvite } from "src/dtos/GameInvite.dto";

import { Observable, Subject } from 'rxjs';
import { GameSettings } from "./types/GameSettings";


@Injectable()
export class GameService {
	games; // [hostId, playerId]
	users;

	myGameSubject = new Subject<Map<string, GameSettings>>();

	constructor() {
		this.games = new Map<string, GameSettings>();
		this.users = new Map();
	}

	createGame(data: GameInvite) { // for status
		this.games.set(data.gameId, {
			playerId: data.playerId,
			gameMode: data.mode
		});
		this.myGameSubject.next(this.games);
	}

	deleteGame(gameId) {
		if (this.games.has(gameId)) {
			this.games.delete(gameId);
			this.myGameSubject.next(this.games);
		}
	}

	getMyMapChanges(): Observable<Map<string, GameSettings>> {
		return this.myGameSubject.asObservable();
	}
	
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
			for (const [key, gameSets] of this.games.entries()) {
				if (gameSets.playerId.localeCompare(leftUserId) == 0) {
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



	async playerJoinGame(data: GameInvite) : Promise<boolean> {
		let count = 0;
		console.log("join game:", data, this.games);
		while (this.games.has(data.gameId) == false && count < 5) {
			await this.sleep(100);
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