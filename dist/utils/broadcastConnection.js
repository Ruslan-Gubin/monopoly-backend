import { aWss } from '../index.js';
export const broadcastConnection = (id, ws, message) => {
    aWss.clients.forEach(client => {
        if (id === client.id) {
            client.send(JSON.stringify(message));
        }
    });
};
