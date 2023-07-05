import { aWss } from '../index.js';
import { ExtendedWebSocket } from '../types/index.js';
import { WebSocket } from 'ws';

export const broadcastConnection = <T>(id: number, ws: WebSocket | ExtendedWebSocket, message: T) => {
  aWss.clients.forEach((client: WebSocket)  => {
    const extendedClient = client as unknown  as ExtendedWebSocket;
    if (id === extendedClient.id) {
      client.send(JSON.stringify(message)) 
    }
  })
}