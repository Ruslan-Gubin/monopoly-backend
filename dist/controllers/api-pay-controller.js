import { logger } from '../utils/loger.js';
export class PayController {
    constructor(payService) {
        this.payService = payService;
        this.handleMessage = (ws, message) => {
            const method = message === null || message === void 0 ? void 0 : message.method;
            try {
                switch (method) {
                    case 'pay':
                        this.payPrice(ws, message);
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
        this.payPrice = async (ws, message) => {
            try {
                await this.payService.payPrice(ws, message);
            }
            catch (error) {
                logger.error('Failed to pay tax:', error);
                ws.send(JSON.stringify({ error: 'Failed to pay tax' }));
            }
        };
    }
}
