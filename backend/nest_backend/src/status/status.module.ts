import { Module } from "@nestjs/common";
import { GameService } from "src/game/game.service";
import { StatusGateway } from "./status.gateway";
import { StatusService } from "./status.service";



@Module({
	providers: [StatusGateway, StatusService]
})
export class Status {}