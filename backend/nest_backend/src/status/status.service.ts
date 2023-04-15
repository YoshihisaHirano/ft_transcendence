import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/services/user/user.service";


@Injectable()
export class StatusService {
	constructor() {
		this.users = new Map(); // [userId: socketId]
	}
	users;

	setUserStatus(userId, socketId, status) {
		this.users.set(userId, socketId);
		// TODO set to db status
	}


	deleteId(socketId) {
		let k: string;

		for (const [key, value] of this.users.entries()) {
			if (value.localeCompare(socketId) == 0) {
				k = key;
				break;
			}
		}
		this.users.delete(k);
	}

	getSocketIdByUser(userId) {
		if (this.users.has(userId)) {
			return this.users.get(userId);
		}
		return null;
	}


}