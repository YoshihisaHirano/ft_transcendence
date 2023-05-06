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


@WebSocketGateway({
	namespace: '/status',
	cors: {
	  credentials: true,
	  origin: 'http://192.168.10.11:5176',
	  methods: ['GET', 'POST'],
	  transports: ['websocket'],
	},
  }
)
export class StatusGateway implements OnGatewayDisconnect {
	@WebSocketServer()
	server;

	constructor(
		private statusService: StatusService,
		private gameService: GameService,
		private userService: UserService
		) {
			this.gameService.getMyMapChanges().subscribe((games) => {
				this.sendGameList(games);
			});

	}

	@SubscribeMessage("userConnect")
    handleUserConnect(client: Socket, userId) {
		this.statusService.setUserStatus(userId, client.id, "online");
		const gameId = this.statusService.getInviteByPlayer(userId);
		if (gameId) {
			client.emit("inviteToGame", gameId);
		}
	}

	handleDisconnect(client: Socket): any { // user disconnect
		this.statusService.deleteId(client.id); // remove invite
		// TODO set to db
	}

	@SubscribeMessage("matchMakingGame") // from any player 
	async handleMatchMakingGame(client: Socket, clientData) {
		const waitingPlayerData = this.statusService.getPlayerMM();
		if (waitingPlayerData) { // can start
			const hostSocket = this.getUserSocket(waitingPlayerData.hostId);
			if (hostSocket) { // good to go
				try {
					const hostName = await this.userService.findUsernameById(waitingPlayerData.hostId);
					const playerName = await this.userService.findUsernameById(clientData.userId);
					const data = {
						gameId: waitingPlayerData.hostId,
						playerId: clientData.userId,
						mode: waitingPlayerData.mode,
						hostName: hostName,
						playerName: playerName,
					}
					console.log("start sending canStartGame");
					hostSocket.emit("canStartGame", data);
					client.emit("canStartGame", data); // TODO add player names 
					console.log("end sending canStartGame");
					return ;
				} catch (error) {
					//(console.log)("can't find user's names in db.");
					//(console.log)(error);
				}

			} else { // host disconnect 
				this.statusService.addPlayerMM(clientData.userId, clientData.mode);
				client.emit("waitInQueue", null); // ?
			}
		} else { // add to queue
			this.statusService.addPlayerMM(clientData.userId, clientData.mode);
			client.emit("waitInQueue", null); // ?
		}
		console.log("don't send canStartGame")
	}

	@SubscribeMessage("inviteUser") // from host
	handleInviteUser(host: Socket, data: GameInvite) {
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
				//(console.log)("can't find user's names in db.");
				//(console.log)(error);
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

	getUserSocket(userId) {
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
				//(console.log)(e);
			}
			
		}
		// //(console.log)(gameArr);
		this.server.emit("updateGameList", gameArr);
	}
}