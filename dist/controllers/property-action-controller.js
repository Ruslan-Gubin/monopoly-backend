import { logger } from '../utils/loger.js';
export class PropertyActionController {
    constructor(gameBoardService) {
        this.gameBoardService = gameBoardService;
        this.handleMessage = (ws, message) => {
            const method = message === null || message === void 0 ? void 0 : message.method;
            try {
                switch (method) {
                    case 'buyProperty':
                        this.buyProperty(ws, message);
                        break;
                    case 'updateProperty':
                        this.updateProperty(ws, message);
                        break;
                    case 'mortgageProperty':
                        this.mortgageProperty(ws, message);
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
        this.buyProperty = async (ws, message) => {
            try {
                await this.gameBoardService.buyProperty(ws, message);
            }
            catch (error) {
                logger.error('Failed to buy property:', error);
                ws.send(JSON.stringify({ error: 'Failed to buy property' }));
            }
        };
        this.updateProperty = async (ws, message) => {
            try {
                await this.gameBoardService.updateProperty(ws, message);
            }
            catch (error) {
                logger.error('Failed to pay tax:', error);
                ws.send(JSON.stringify({ error: 'Failed to pay tax' }));
            }
        };
        this.mortgageProperty = async (ws, message) => {
            try {
                await this.gameBoardService.mortgageProperty(ws, message);
            }
            catch (error) {
                logger.error('Failed to pay tax:', error);
                ws.send(JSON.stringify({ error: 'Failed to pay tax' }));
            }
        };
    }
}
