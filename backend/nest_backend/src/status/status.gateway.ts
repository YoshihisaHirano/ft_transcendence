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

	}

	handleDisconnect(client: Socket): any { // user disconnect
		this.statusService.deleteId(client.id)
		// TODO set to db
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
			playerSocket.emit("inviteToGame", data.gameId);
			host.emit("inviteSuccess", null);
		} else {
			host.emit("inviteFail", "some internal error");
		}
	}

	@SubscribeMessage("cancelInvite") // from host
	handleCancelInvite(host: Socket, data: GameInvite) {
		const playerSocket: Socket = this.getUserSocket(data.playerId);
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
	}

	getUserSocket(userId) {
		const socketId: string = this.statusService.getSocketIdByUser(userId);
		if (socketId && this.server.sockets.has(socketId)) {
			return this.server.sockets.get(socketId);
		}
		return null;
	}


}