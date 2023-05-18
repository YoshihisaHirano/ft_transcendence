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

	@SubscribeMessage("createGame")
	handleNewGame(client: Socket, data: GameInvite) {
		if (data == null || data.gameId == null || data.mode == null || data.playerId == null) {
			console.log("createGame on gateway data error", data);
			return ;
		}
		this.gameService.addUser(data.gameId, client.id);
		this.gameService.createGame(data);
		client.join(data.gameId);
	}

	@SubscribeMessage("playerJoinGame")
	async handleJoinGame(client: Socket, data: GameInvite) { // hostId, playerId
		if (data == null || data.gameId == null || data.playerId == null) {
			console.log("playerJoinGame on gateway data error", data);
			return ;
		}
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
	handleSpectatorJoinGame(client: Socket, gameIdInput) { // hostId, playerId
		if (gameIdInput == null) {
			console.log("spectatorJoinGame", gameIdInput)
			return ;
		}
		 const gameData =  this.gameService.spectatorJoinGame(gameIdInput);
		 if (gameData) {
			client.join(gameIdInput);
			const data = {
				gameId: gameIdInput,
				hostScore: gameData.hostScore,
				playerScore: gameData.playerScore,
			};
			client.emit("spectatorJoinGame", data);
		 } else {
			client.emit("joinGameFail", null);
		 }
	}

	@SubscribeMessage("finishGame")
	handleFinishGame(client: Socket, data: GameInvite) {
		// check input data. ids?? 
		this.gameService.deleteGame(data.gameId);
		this.server.to(data.gameId).emit("finishGame", data);
		this.statusGateway.updateStatus(data.gameId, StatusMode.ONLINE);
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

	// scores.score1;
	// scores.score2 ;
	@SubscribeMessage("scoreUpdate")
	handlescoreUpdate(client: Socket, data: GameData) {
		this.gameService.setScores(data);
		this.server.to(data.gameId).emit('scoreUpdate', data);
	}
}