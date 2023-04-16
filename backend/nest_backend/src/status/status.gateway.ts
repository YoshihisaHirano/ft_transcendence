import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { GameData } from "src/dtos/gameData.dto";
import { GameInvite } from "src/dtos/GameInvite.dto";
import { GameService } from "src/game/game.service";
import { StatusService } from "./status.service";


@WebSocketGateway({
	namespace: '/status',
	cors: {
	  credentials: true,
	  origin: 'http://localhost:5176',
	  methods: ['GET', 'POST'],
	  transports: ['websocket'],
	},
  }
)

export class StatusGateway implements OnGatewayDisconnect {
	constructor(
		private statusService: StatusService
		) {
	}

	@WebSocketServer()
	server;

	// users;

	@SubscribeMessage("userConnect")
    handleUserConnect(client: Socket, userId) {
		console.log(userId);
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
	handleMatchMakingGame(client: Socket, clientData) {
		const waitingPlayer = this.statusService.getPlayerMM();
		if (waitingPlayer) { // can start
			const hostSocket = this.getUserSocket(waitingPlayer);
			if (hostSocket) {
				const data = {
					gameId: waitingPlayer,
					playerId: clientData.userId,
					mode: clientData.mode
				}
				hostSocket.emit("canStartGame", data);
				client.emit("canStartGame", data);
			} else { // host disconnect
				this.statusService.addPlayerMM(clientData.userId);
				client.emit("waitInQueue", null); // ?
			}
		} else { // add to queue
			this.statusService.addPlayerMM(clientData.userId);
			client.emit("waitInQueue", null); // ?
		}

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
	handleInviteAccepted(player: Socket, data: GameInvite) {
		const hostSocket: Socket = this.getUserSocket(data.gameId);
		if (hostSocket) {
			hostSocket.emit("canStartGame", data);
			player.emit("canStartGame", data);
			this.statusService.removeInvite(data.gameId); // no need but still
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


}