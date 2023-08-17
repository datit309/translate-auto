import {WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer} from '@nestjs/websockets';
import { WebsocketService } from './websocket.service';
import { CreateWebsocketDto } from './dto/create-websocket.dto';
import { UpdateWebsocketDto } from './dto/update-websocket.dto';
import { Server } from 'socket.io';

@WebSocketGateway(2088)
export class WebsocketGateway {
  constructor(private readonly websocketService: WebsocketService) {}

  @WebSocketServer()
  server: Server;

  // client
  // const socket = new WebSocket('ws://localhost:3000');
  //
  // socket.onopen = () => {
  //   console.log('Connected to server');
  //
  //   // Gửi một sự kiện message đến server
  //   socket.send(JSON.stringify({
  //     event: 'message',
  //     data: 'Hello from client'
  //   }));
  // };
  //
  // socket.onmessage = (event) => {
  //   console.log('Received message from server:', event.data);
  // };
  //
  // socket.onclose = () => {
  //   console.log('Disconnected from server');
  // };

  @SubscribeMessage('createWebsocket')
  create(@MessageBody() createWebsocketDto: CreateWebsocketDto) {
    this.server.emit('message', {});
    return this.websocketService.create(createWebsocketDto);
  }

  @SubscribeMessage('findAllWebsocket')
  findAll() {
    return this.websocketService.findAll();
  }

  @SubscribeMessage('findOneWebsocket')
  findOne(@MessageBody() id: number) {
    return this.websocketService.findOne(id);
  }

  @SubscribeMessage('updateWebsocket')
  update(@MessageBody() updateWebsocketDto: UpdateWebsocketDto) {
    return this.websocketService.update(updateWebsocketDto.id, updateWebsocketDto);
  }

  @SubscribeMessage('removeWebsocket')
  remove(@MessageBody() id: number) {
    return this.websocketService.remove(id);
  }
}
