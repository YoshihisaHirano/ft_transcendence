import { Module } from "@nestjs/common";
import { StatusGateway } from "./status.gateway";
import { StatusService } from "./status.service";



@Module({
	providers: [StatusService, StatusGateway]
})
export class Status {}