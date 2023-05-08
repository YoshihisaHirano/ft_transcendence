import { Module, forwardRef } from "@nestjs/common";
import { GameGateway } from "./game.gateway";
import { GameService } from "./game.service";
import { StatusGateway } from "src/status/status.gateway";
import { Status } from "src/status/status.module";


@Module({
	providers: [GameGateway, GameService],
	exports: [GameService],
	imports: [
		Status
	]
})
export class Game {}