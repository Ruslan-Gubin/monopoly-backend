;
import { logger } from '../utils/loger.js';
export class MoveController {
    constructor(moveService) {
        this.moveService = moveService;
        this.handleMessage = (ws, message) => {
            const method = message === null || message === void 0 ? void 0 : message.method;
            try {
                switch (method) {
                    case 'roolDice':
                        this.roolDice(ws, message);
                        break;
                    case 'finishedMove':
                        this.finishedMove(ws, message);
                        break;
                    default:
                        throw new Error('Invalid method');
                }
            }
            catch (error) {
                logger.error('Failed to handle WebSocket message:', error);
                ws.send(JSON.stringify({ error: 'Failed to handle WebSocket message' }));
            }
        };
        this.roolDice = async (ws, message) => {
            try {
                await this.moveService.roolDice(ws, message);
            }
            catch (error) {
                logger.error('Failed to rool dice:', error);
                ws.send(JSON.stringify({ error: 'Failed to rool dice' }));
            }
        };
        this.finishedMove = async (ws, message) => {
            try {
                await this.moveService.finishedMove(ws, message);
            }
            catch (error) {
                logger.error('Failed to update players finished move:', error);
                ws.send(JSON.stringify({ error: 'Failed to update players finished move:' }));
            }
        };
    }
}
