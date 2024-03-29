import { Injectable } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { GameInvite } from "src/dtos/GameInvite.dto";
import { GameService } from "src/game/game.service";
import { StatusService } from "./status.service";
import { Observable, Subject } from 'rxjs';
import { GameDataFull } from "./types/GameData";

import { Subscription } from "rxjs";
import { UserService } from "src/user/services/user/user.service";
import { GameSettings } from "src/game/types/GameSettings";
import { WaitingGame } from "./types/WaitingGame";
import { StatusMode } from "src/entities/user.entity";

@WebSocketGateway({
	namespace: '/status',
	cors: {
	  credentials: true,
	  origin: ['http://172.20.0.11:5176', 'http://localhost:5176'],
	  methods: ['GET', 'POST'],
	  transports: ['websocket'],
	},
  }
)
export class StatusGateway implements OnGatewayDisconnect {
	@WebSocketServer()
	server;
	gamesCopy : Array<GameDataFull>; // copy for new users.

	constructor(
		private statusService: StatusService,
		private gameService: GameService,
		private userService: UserService
		) {
			this.gamesCopy = new Array<GameDataFull>();
			this.gameService.getMyMapChanges().subscribe((games) => {
				this.sendGameList(games);
			});
	}

	async updateStatus(userId, status) {
		if (userId == null) {
			// console.log("update status data error");
			return ;
		}
		if (userId) {
			try {
				await this.userService.changeUserStatus(userId, status);
				const data = {
					userId: userId,
					status: status
				}
				this.server.emit("userStatusUpdate", data);
			} catch (error) {
				// console.log(error);
			}
		}
	}

	@SubscribeMessage("userConnect")
	handleUserConnect(client: Socket, userId) {
		this.statusService.addUser(userId, client.id);
		client.emit("updateGameList", this.gamesCopy);
		const gameInvite:GameInvite = this.statusService.getInviteByPlayer(userId);
		this.updateStatus(userId, StatusMode.ONLINE);
		// // console.log("getInviteByPlayer: ", gameId);
		if (gameInvite) {
			client.emit("inviteToGame", gameInvite);
		}
	}

	@SubscribeMessage("exitMatchmaking")
	handleExitMatchmaking(client: Socket, data) {
		this.statusService.removeWaitingGame(client.id);
	}

	handleDisconnect(client: Socket): any { // user disconnect
		const userId = this.statusService.deleteId(client.id); // remove invite
		// // console.log("handleDisconnect for: ", userId);
		const playerId = this.statusService.removeInvite(userId);
		// // console.log("removeInvite result: ", playerId);
		if (playerId) { // has pending invite
			const playerSocketId: Socket = this.getUserSocket(playerId);
			if (playerSocketId) {
				playerSocketId.emit("cancelInvite", null);
			}
		}
		this.statusService.removeWaitingGame(client.id);
		if (userId)
			this.updateStatus(userId, StatusMode.OFFLINE);

		// cancel game
	}

	@SubscribeMessage("matchMakingGame") // from any player 
	async handleMatchMakingGame(client: Socket, clientData) {
		if (clientData == null || clientData.userId == null || clientData.mode == null) {
			// console.log("Zubkova!!! Gde moi dannue????");
		}
		const waitingGame = new WaitingGame(clientData.userId, clientData.mode, client.id);
		const gameArr = this.statusService.addWaitingGame(waitingGame);
		// // console.log(gameArr);
		if (gameArr  == null) return ; // no game ready
		try { // can start game.
			const hostName = await this.userService.findUsernameById(gameArr[0].playerId);
			const playerName = await this.userService.findUsernameById(gameArr[1].playerId);
			const data = {
				gameId: gameArr[0].playerId,
				playerId: gameArr[1].playerId,
				mode: gameArr[0].gameMode,
				hostName: hostName,
				playerName: playerName,
			}
			if (this.server.sockets.has(gameArr[0].socketId) == false  || this.server.sockets.has(gameArr[1].socketId) == false) {
					// console.log("someone leave site. it's really bad. we are fucked. don't delete it!!");
					return ;
			}
			this.server.sockets.get(gameArr[0].socketId).emit("canStartGame", data);
			this.server.sockets.get(gameArr[1].socketId).emit("canStartGame", data);
		} catch (e) {
			// console.log("can't find user's names in db.");
			// console.log(e);
		}
	}

	@SubscribeMessage("inviteUser") // from host
	handleInviteUser(host: Socket, data: GameInvite) {
		if (data == null || data.gameId == null || data.mode == null || data.playerId == null) {
			// console.log("inviteUser data error", data);
			return ;
		}
		const playerSocketId: string = this.statusService.getSocketIdByUser(data.playerId);
		if (playerSocketId == null) {
			host.emit("inviteFail", "user offline");
			return ;
		}
		const playerSocket: Socket = this.server.sockets.get(playerSocketId);
		if (playerSocket) {
			this.statusService.addInvite(data);
			playerSocket.emit("inviteToGame", data);
			host.emit("inviteSuccess", null);
		} else {
			host.emit("inviteFail", "some internal error");
		}
	}

	@SubscribeMessage("cancelInvite") // from host
	handleCancelInvite(host: Socket, data: GameInvite) {
		const playerSocket: Socket = this.getUserSocket(data.playerId);
		this.statusService.removeInvite(data.gameId);
		if (playerSocket) {
			playerSocket.emit("cancelInvite", data);
		}
	}

	@SubscribeMessage("inviteAccepted") // from player
	async handleInviteAccepted(player: Socket, data: GameInvite) {
		const hostSocket: Socket = this.getUserSocket(data.gameId);
		if (hostSocket) {
			try {
				const hostName = await this.userService.findUsernameById(data.gameId);
				const playerName = await this.userService.findUsernameById(data.playerId);
				const gameCanStartData = {
					gameId: data.gameId,
					playerId: data.playerId,
					mode: data.mode,
					hostName: hostName,
					playerName: playerName,
				}
				hostSocket.emit("canStartGame", gameCanStartData);
				player.emit("canStartGame", gameCanStartData);
				this.statusService.removeInvite(data.gameId); // no need but still
			} catch (error) {
				// console.log("can't find user's names in db.");
				// console.log(error);
			}

		} else {
			player.emit("joinGameError", null);
		}
	}

	@SubscribeMessage("rejectInvite") // from player
	handleRejectInvite(player: Socket, data: GameInvite) {
		const hostSocket: Socket = this.getUserSocket(data.gameId);
		if (hostSocket) {
			hostSocket.emit("inviteRejected", null);
		}
		this.statusService.removeInvite(data.gameId);
	}

	getUserSocket(userId): Socket {
		const socketId: string = this.statusService.getSocketIdByUser(userId);
		if (socketId && this.server.sockets.has(socketId)) {
			return this.server.sockets.get(socketId);
		}
		return null;
	}


	async sendGameList(games: Map<string, GameSettings>) {
		const gameArr = new Array<GameDataFull>();
		for (const [gameId, gameSetting] of games.entries()) {
			try {
				const hostName = await this.userService.findUsernameById(gameId);
				const playerName = await this.userService.findUsernameById(gameSetting.playerId);
				if (hostName && playerName) {
					const curData = new GameDataFull();
					curData.gameId = gameId;
					curData.playerId = gameSetting.playerId;
					curData.hostName = hostName;
					curData.playerName = playerName;
					curData.gameMode = gameSetting.gameMode;
					gameArr.push({...curData});
				}
			} catch (e) {
				// console.log(e);
			}
		}
		// // console.log(gameArr);
		this.server.emit("updateGameList", gameArr);
		this.gamesCopy = gameArr;
	}

	isUserOnline(userId) {
		return this.statusService.isUserOnline(userId);
	}
}