import { logger } from '../utils/loger.js';
export class MessageController {
    constructor(messageService) {
        this.messageService = messageService;
        this.handleMessage = (ws, message) => {
            const method = message.method;
            try {
                switch (method) {
                    case 'createMessage':
                        this.createMessage(ws, message);
                        break;
                }
            }
            catch (error) {
                logger.error('Failed to handle WebSocket message:', error);
                ws.send(JSON.stringify({ error: 'Failed to MessageController' }));
            }
        };
        this.createMessage = async (ws, message) => {
            try {
                await this.messageService.createMessage(ws, message.body);
            }
            catch (error) {
                logger.error('Failed to create new message:', error);
                ws.send(JSON.stringify({ error: 'Failed to createMessage' }));
            }
        };
    }
}
