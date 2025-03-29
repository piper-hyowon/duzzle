import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class WebSocketService {
  private clients: Set<Socket> = new Set();

  constructor() {
    Logger.log(WebSocketService.name, ': init');
  }

  addClient(client: Socket): void {
    this.clients.add(client);
  }

  removeClient(client: Socket): void {
    this.clients.delete(client);
  }
}
