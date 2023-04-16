import { Module } from "@nestjs/common";
import { Game } from "src/game/game.module";
import { GameService } from "src/game/game.service";
import { StatusGateway } from "./status.gateway";
import { StatusService } from "./status.service";



@Module({
	providers: [StatusGateway, StatusService],
	imports: [Game]
})
export class Status {}