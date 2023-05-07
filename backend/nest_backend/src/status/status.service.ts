import { Injectable } from "@nestjs/common";
import { GameInvite } from "src/dtos/GameInvite.dto";
import { UserService } from "src/user/services/user/user.service";
import { WaitingGame } from "./types/WaitingGame";


@Injectable()
export class StatusService {
	constructor() {
		this.users = new Map(); // [userId: socketId]
		this.pendingInvites = new Map(); // [userId: socketId]
		this.mmQueue = new Array<WaitingGame>(); // [userId] TODO add mode 
	}
	users;
	pendingInvites;
	mmQueue;

	setUserStatus(userId, socketId, status) {
		this.users.set(userId, socketId);
	}

	isUserOnline(userId) {
		return this.users.has(userId);
	}

	addInvite(invite: GameInvite) {
		this.pendingInvites.set(invite.gameId, invite.playerId);
	}

	removeInvite(gameId) {
		if (this.pendingInvites.has(gameId)) {
			this.pendingInvites.delete(gameId);
		}
	}

	getInviteByPlayer(playerId) {
		for (const [key, value] of this.pendingInvites.entries()) {
			if (value.localeCompare(playerId) == 0) {
				return key;
			}
		}
		return null;
	}

	deleteId(socketId) {
		let userId: string;
		let mmIndex: Number;
		for (const [key, value] of this.users.entries()) {
			if (value.localeCompare(socketId) == 0) {
				userId = key;
				break;
			}
		}
		this.users.delete(userId); 
		if (this.pendingInvites.has(userId)) {
			this.pendingInvites.delete(userId);
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
			if (this.mmQueue[i].socketId.localeCompare(socketId) == 0) {
				this.mmQueue.splice(i, 1);
				return ;
			}
		}
	}

}