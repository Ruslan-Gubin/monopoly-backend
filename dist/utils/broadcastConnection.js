import { aWss } from '../index.js';
export const broadcastConnection = (id, ws, message) => {
    aWss.clients.forEach((client) => {
        const extendedClient = client;
        if (id === extendedClient.id) {
            client.send(JSON.stringify(message));
        }
    });
};
