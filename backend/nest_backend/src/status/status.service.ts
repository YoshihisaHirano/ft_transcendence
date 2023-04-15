import { Injectable } from "@nestjs/common";
import { GameInvite } from "src/dtos/GameInvite.dto";
import { UserService } from "src/user/services/user/user.service";


@Injectable()
export class StatusService {
	constructor() {
		this.users = new Map(); // [userId: socketId]
		this.pendingInvites = new Map(); // [userId: socketId]
	}
	users;
	pendingInvites;

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
	}

	getSocketIdByUser(userId) {
		if (this.users.has(userId)) {
			return this.users.get(userId);
		}
		return null;
	}


}