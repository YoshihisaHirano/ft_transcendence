import { Module } from "@nestjs/common";
import { Game } from "src/game/game.module";
import { GameService } from "src/game/game.service";
import { UserModule } from "src/user/user.module";
import { StatusGateway } from "./status.gateway";
import { StatusService } from "./status.service";



@Module({
	providers: [StatusGateway, StatusService],
	imports: [Game, UserModule]
})
export class Status {}