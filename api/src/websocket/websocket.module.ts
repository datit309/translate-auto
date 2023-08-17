import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { WebsocketGateway } from './websocket.gateway';

@Module({
  providers: [WebsocketGateway, WebsocketService]
})
export class WebsocketModule {}
