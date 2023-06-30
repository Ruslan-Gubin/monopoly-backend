import { aWss } from '../index.js';

export const broadcastConnection = (id: number, ws: any, message: unknown) => {
  aWss.clients.forEach(client  => {
    //@ts-ignore
    if (id === client.id) {
      client.send(JSON.stringify(message)) 
    }
  })
}