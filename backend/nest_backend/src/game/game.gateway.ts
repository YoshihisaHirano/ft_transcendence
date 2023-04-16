import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { GameData } from "src/dtos/gameData.dto";
import { GameInvite } from "src/dtos/GameInvite.dto";
import { StatusService } from "src/status/status.service";
import { GameService } from "./game.service";


@WebSocketGateway({
	namespace: '/game',
	cors: {
	  credentials: true,
	  origin: 'http://localhost:5176',
	  methods: ['GET', 'POST'],
	  transports: ['websocket'],
	},
  }
)

export class GameGateway implements OnGatewayDisconnect {
	constructor(
		private gameService: GameService,
		)  {
	}

	@WebSocketServer()
	server;


	getUserSocket(userId) {
		const socketId = this.gameService.getUserSocketId(userId);
		if (socketId && this.server.sockets.has(socketId)) {
			return this.server.sockets.get(socketId);
		}
	}

	@SubscribeMessage("createGame")
	handleNewGame(client: Socket, data: GameInvite) {
		this.gameService.addUser(data.gameId, client.id);
		this.gameService.createGame(data);
		client.join(data.gameId);
	}

	@SubscribeMessage("playerJoinGame")
	async handleJoinGame(client: Socket, data: GameInvite) { // hostId, playerId
		const joinRes =  await this.gameService.playerJoinGame(data);
		console.log(data, client.id, joinRes);
		 if (joinRes) {
			this.gameService.addUser(data.playerId, client.id);
			client.join(data.gameId);
			this.server.to(data.gameId).emit("gameStart", data);
		 } else {
			client.emit("joinGameFail", null);
		 }
	}

	@SubscribeMessage("spectatorJoinGame")
	handleSpectatorJoinGame(client: Socket, gameId) { // hostId, playerId
		 const joinRes =  this.gameService.spectatorJoinGame(gameId);
		 if (joinRes) {
			client.join(gameId);
			client.emit("spectatorJoinGame", gameId);
		 } else {
			client.emit("joinGameFail", null);
		 }
	}

	@SubscribeMessage("finishGame")
	handleFinishGame(client: Socket, data: GameInvite) {
		this.gameService.deleteGame(data.gameId);
		this.server.to(data.gameId).emit("finishGame", data);
	}


	handleDisconnect(client: Socket) {
		const leftPlayerId = this.gameService.getUserIdBySocketId(client.id);
		if (leftPlayerId)  { // one of players
			const secondPlayer = this.gameService.getSecondPlayerId(leftPlayerId);
			const gameId: string = this.gameService.getGameId(leftPlayerId, secondPlayer);
			if (secondPlayer || this.gameService.isUserGameHost(leftPlayerId)) {
				this.gameService.removeUser(leftPlayerId);
				this.gameService.removeUser(secondPlayer);
				if (gameId) {
					this.server.to(gameId).emit("endOfGame", null);
				}
				this.gameService.deleteGame(gameId);
			}
		} else { // left spectator
			// nothing
		}
	}

	@SubscribeMessage("gameDataUpdate")
	handleDataUpdate(client: Socket, data: GameData) {
		this.server.to(data.gameId).emit(data.gamePositions);
	}

	/*
		gameHostData (ball, host pos)
		playerData (host pos)
		changeScore (score data)
	*/
}