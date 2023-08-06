import { logger } from '../utils/loger.js';
export class AuctionController {
    constructor(auctionService) {
        this.auctionService = auctionService;
        this.handleMessage = (ws, message) => {
            const method = message === null || message === void 0 ? void 0 : message.method;
            try {
                switch (method) {
                    case 'auctionRefresh':
                        this.auctionRefresh(ws, message);
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
        this.auctionRefresh = async (ws, message) => {
            try {
                await this.auctionService.auctionRefresh(ws, message);
            }
            catch (error) {
                logger.error('Failed to connect WebSocket:', error);
                ws.send(JSON.stringify({ error: 'Failed to connect WebSocket' }));
            }
        };
    }
}
