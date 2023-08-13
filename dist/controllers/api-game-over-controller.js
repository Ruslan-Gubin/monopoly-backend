import { logger } from '../utils/loger.js';
export class GameOverController {
    constructor(gameOverService) {
        this.gameOverService = gameOverService;
        this.handleMessage = (ws, message) => {
            const method = message === null || message === void 0 ? void 0 : message.method;
            try {
                switch (method) {
                    case 'playerGameOver':
                        this.playerGameOver(ws, message);
                        break;
                    case 'removeGame':
                        this.removeGame(message.body.board_id);
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
        this.playerGameOver = async (ws, message) => {
            try {
                await this.gameOverService.playerGameOver(ws, message);
            }
            catch (error) {
                logger.error('Failed to connect WebSocket:', error);
                ws.send(JSON.stringify({ error: 'Failed to connect WebSocket' }));
            }
        };
        this.removeGame = async (board_id) => {
            try {
                await this.gameOverService.removeGame(board_id);
            }
            catch (error) {
                logger.error('Failed to connect WebSocket:', error);
            }
        };
    }
}
