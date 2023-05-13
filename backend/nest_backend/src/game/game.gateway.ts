import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { GameData } from "src/dtos/gameData.dto";
import { GameInvite } from "src/dtos/GameInvite.dto";
import { StatusService } from "src/status/status.service";
import { GameService } from "./game.service";
import { Inject } from "@nestjs/common";
import { StatusGateway } from "src/status/status.gateway";
import { StatusMode } from "src/entities/user.entity";


@WebSocketGateway({
	namespace: '/game',
	cors: {
	  credentials: true,
	  origin: ['http://172.20.0.11:5176', 'http://localhost:5176'],
	  methods: ['GET', 'POST'],
	  transports: ['websocket'],
	},
  }
)

export class GameGateway implements OnGatewayDisconnect {
	constructor(
		private gameService: GameService,
		private statusGateway : StatusGateway
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
		console.log("createGame", data);
		client.join(data.gameId);
	}

	@SubscribeMessage("playerJoinGame")
	async handleJoinGame(client: Socket, data: GameInvite) { // hostId, playerId
		const joinRes =  await this.gameService.playerJoinGame(data);
		//(console.log)(data, client.id, joinRes);
		 if (joinRes) {
			this.gameService.addUser(data.playerId, client.id);
			client.join(data.gameId);
			this.server.to(data.gameId).emit("gameStart", data);
			this.statusGateway.updateStatus(data.gameId, StatusMode.GAME);
			this.statusGateway.updateStatus(data.playerId, StatusMode.GAME);
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
		// check input data. ids?? 
		this.gameService.deleteGame(data.gameId);
		this.server.to(data.gameId).emit("finishGame", data);
		this.statusGateway.updateStatus(data.gameId, StatusMode.ONLINE); // twisy? 
		this.statusGateway.updateStatus(data.playerId, StatusMode.ONLINE);
	}


	handleDisconnect(client: Socket) {
		const leftPlayerId = this.gameService.getUserIdBySocketId(client.id);
		if (leftPlayerId)  { // one of players
			this.gameService.sleep(100); // if player offline total its time to status socker change it.
			if (this.statusGateway.isUserOnline(leftPlayerId)) {
				this.statusGateway.updateStatus(leftPlayerId, StatusMode.ONLINE);
			}
			const secondPlayer = this.gameService.getSecondPlayerId(leftPlayerId);
			const gameId: string = this.gameService.getGameId(leftPlayerId, secondPlayer);
			if (secondPlayer) {
				this.gameService.removeUser(secondPlayer);
				this.statusGateway.updateStatus(secondPlayer, StatusMode.ONLINE);
			}
			this.gameService.removeUser(leftPlayerId);
			if (gameId) {
				this.server.to(gameId).emit("endOfGame", null);
				this.gameService.deleteGame(gameId);
			}
		} else { // left spectator
			// nothing
		}
	}


	@SubscribeMessage("ballPositionUpdate")
	handleBallUpdate(client: Socket, data: GameData) {
		this.server.to(data.gameId).emit('ballPositionUpdate', data);
	}

	@SubscribeMessage("leftPaddleUpdate")
	handleLeftPaddleUpdate(client: Socket, data: GameData) {
		this.server.to(data.gameId).emit('leftPaddleUpdate', data);
	}

	@SubscribeMessage("rightPaddleUpdate")
	handleRightPaddleUpdate(client: Socket, data: GameData) {
		this.server.to(data.gameId).emit('rightPaddleUpdate', data);
	}

	@SubscribeMessage("scoreUpdate")
	handlescoreUpdate(client: Socket, data: GameData) {
		this.server.to(data.gameId).emit('scoreUpdate', data);
	}

// debug
	@SubscribeMessage("test")
	handleTest(client, id) {
		this.gameService.createGame({
			gameId: id,
			playerId: "sdfsdf",
			mode: 'easy'
		})
	}

	/*
		gameHostData (ball, host pos)
		playerData (host pos)
		changeScore (score data)
	*/
}