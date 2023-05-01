import { Injectable } from "@nestjs/common";
import { GameInvite } from "src/dtos/GameInvite.dto";
import { UserService } from "src/user/services/user/user.service";


@Injectable()
export class StatusService {
	constructor() {
		this.users = new Map(); // [userId: socketId]
		this.pendingInvites = new Map(); // [userId: socketId]
		this.mmQueue = new Array(); // [userId] TODO add mode 
		this.mmModeMap = new Map<string, string>(); // [userId, mode]
	}
	users;
	pendingInvites;
	mmQueue;
	mmModeMap;
	
	mmGame;

	setUserStatus(userId, socketId, status) {
		this.users.set(userId, socketId);
		// TODO set to db status
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
		this.users.delete(userId); // invites
		if (this.pendingInvites.has(userId)) {
			this.pendingInvites.delete(userId);
		}
		// delete from mm queue
		mmIndex = this.mmQueue.indexOf(userId);
		if (this.mmQueue != -1) {
			this.mmQueue.splice(mmIndex, 1);
		}
		if (this.mmModeMap.has(userId)) {
			this.mmModeMap.delete(userId);
		}
	}

	getSocketIdByUser(userId) {
		if (this.users.has(userId)) {
			return this.users.get(userId);
		}
		return null;
	}

					/*  mm logic  */
	getPlayerMM() {
		if (this.mmQueue.length > 0) {
			const hostId = this.mmQueue.shift();
			if (this.mmModeMap.has(hostId)) {
				const data = {
					hostId: hostId,
					mode: this.mmModeMap.get(hostId)
				}
				return data;
			}
		}
		return null;
	}

	addPlayerMM(userId, gameMode) {
		this.mmQueue.push(userId);
		this.mmModeMap.set(userId, gameMode);
	}

}