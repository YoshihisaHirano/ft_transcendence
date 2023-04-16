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
		private statusService: StatusService,
		private gameService: GameService
		)  {

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

	@SubscribeMessage("inviteUser")
	hansleInviteUser(host: Socket, data: GameInvite) {
		const playerSocketId: string = this.statusService.getSocketIdByUser(data.playerId);
		if (playerSocketId == null) {
			host.emit("inviteFail", "user not online");
			return ;
		}
		const playerSocket: Socket = this.server.sockets.get(playerSocketId);
		if (playerSocket) {
			this.gameService.newGame(data.gameId);
			playerSocket.emit("inviteToGame", data.gameId);
			host.emit("inviteSuccess", null);
		} else {
			host.emit("inviteFail", "some internal error");
		}
	}

	@SubscribeMessage("rejectInvite")
	handleRejectInvite(player: Socket, gameId) {
		const hostSocketId: string = this.statusService.getSocketIdByUser(gameId);
		const hostSocket: Socket = this.server.sockets.get(hostSocketId);
		this.gameService.endGame(gameId); // deletes from games 
		if (hostSocket) {
			hostSocket.emit("rejectInvite", null);
		}
	}
}