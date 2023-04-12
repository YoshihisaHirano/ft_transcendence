import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { GameData } from "src/dtos/gameData.dto";
import { StatusService } from "src/status/status.service";
import { GameService } from "./game.service";


@WebSocketGateway({
	namespace: '/game',
	cors: {
	  credentials: true,
	  origin: 'http://127.0.0.1:5501',
	  methods: ['GET', 'POST'],
	  transports: ['websocket'],
	},
  }
)

export class GameGateway implements OnGatewayDisconnect {
	constructor(
		private gameService: GameService,
		private statusService: StatusService
		)  {
		this.usersById = new Map();
		this.usersBySocket = new Map();
	}

	@WebSocketServer()
	server;
	usersById;
	usersBySocket;

	@SubscribeMessage("newGame")
	handleNewGame(client: Socket, userId) {
		this.usersById.set(userId, client.id);
		this.usersBySocket.set(client.id, userId);
		client.join(userId);
		// dev
		this.server.emit("newGame", userId); // now host wait 
	}

	@SubscribeMessage("joinGame")
	handleJoinGame(client: Socket, data) { // hostId, playerId
		const host = this.server.sockets.get(this.usersById.get(data.hostId));
		if (host && this.gameService.joinGame(data.hostId, data.playerId)) {
			this.usersById.set(data.playerId, client.id);
			this.usersBySocket.set(client.id, data.playerId);
			client.join(data.hostId);
			this.server.to(data.hostId).emit("gameStart", null);
		}
		else {
			client.emit("joinGameFail", null);
			if (host) {
				host.emit("gameCreateFail", null);
			}
		}
	}

	@SubscribeMessage("cancelGame")
	handleCancelGame(client: Socket, userId) {
		client.leave(userId);
		this.usersById.delete(userId);
		this.usersBySocket.set(client.id);
		this.gameService.endGame(userId);
	}

	// disconnect
	handleDisconnect(client: Socket) {
		// find game in games 
		// send stop 
		// leave room
	}

	@SubscribeMessage("gameDataUpdate")
	handleDataUpdate(client: Socket, data: GameData) {
		this.server.to(data.gameId).emit(data.gamePositions);
	}

	// @SubscribeMessage("gameEndByHost") // only host? 
	// handleGameEnd(client: Socket, data: GameData) {
	// 	const player = this.gameService.endGame(data.gameId);
	// 	const playerSocket = this.server.sockets.get(this.usersById.get(player));
		
	// 	this.usersById.delete(data.gameId); // host
	// 	this.usersById.delete(player); // player

	// 	this.server.to(data.gameId).emit("gameEnd", null);
	// 	client.leave(data.gameId);
	// 	playerSocket.leave(data.gameId);
	// }

}