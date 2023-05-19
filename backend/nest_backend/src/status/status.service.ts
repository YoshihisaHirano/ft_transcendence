import { Injectable } from "@nestjs/common";
import { GameInvite } from "src/dtos/GameInvite.dto";
import { UserService } from "src/user/services/user/user.service";
import { WaitingGame } from "./types/WaitingGame";


@Injectable()
export class StatusService {
	constructor() {
		this.users = new Map(); // [userId: socketId]
		this.pendingInvites = new Map<string, GameInvite>(); // [gameId, playerId]
		this.mmQueue = new Array<WaitingGame>(); // [userId] TODO add mode 
	}
	users;
	pendingInvites;
	mmQueue;

	addUser(userId, socketId) {
		this.users.set(userId, socketId);
	}

	isUserOnline(userId) {
		return this.users.has(userId);
	}

	addInvite(invite: GameInvite) {
		this.pendingInvites.set(invite.gameId, invite);
	}

	removeInvite(gameId) {
		if (this.pendingInvites.has(gameId)) {
			const gameData: GameInvite = this.pendingInvites.get(gameId);
			this.pendingInvites.delete(gameId);
			return gameData.playerId;
		}
		return null;
	}

	getInviteByPlayer(playerId): GameInvite {
		for (const [gameId, gameInvate] of this.pendingInvites.entries()) {
			if (gameInvate.playerId.localeCompare(playerId) == 0) {
				return gameInvate;
			}
		}
		return null;
	}

	deleteId(socketId) {
		let userId: string;
		for (const [key, value] of this.users.entries()) {
			if (value && value.localeCompare(socketId) == 0) {
				userId = key;
				this.users.delete(userId); // i hope this line not break anything
				break;
			}
		}
		return userId;
	}

	getSocketIdByUser(userId) {
		if (this.users.has(userId)) {
			return this.users.get(userId);
		}
		return null;
	}

	/*  mm logic  */

	addWaitingGame(data: WaitingGame): Array<WaitingGame> | null{
		this.mmQueue.push(data);
		if (this.mmQueue.length > 1) {
			return this.mmQueue.splice(0, 2);
		} 
		return null;
	}

	removeWaitingGame(socketId: string) {
		let i = 0;
		for ( ; i < this.mmQueue.length; i++) {
			if (this.mmQueue[i].socketId && this.mmQueue[i].socketId.localeCompare(socketId) == 0) {
				this.mmQueue.splice(i, 1);
				return ;
			}
		}
	}

}