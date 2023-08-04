import { logger } from '../utils/index.js';
export class DiceController {
    constructor(diceService) {
        this.diceService = diceService;
        this.handleMessage = (ws, message) => {
            const method = message === null || message === void 0 ? void 0 : message.method;
            try {
                switch (method) {
                    case 'roolDice':
                        this.diceUpdate(ws, message);
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
        this.getDiceInBoard = async (req, res) => {
            try {
                const diceId = req.params.id;
                const dice = await this.diceService.getDiceInBoard(diceId);
                res.status(201).json(dice);
            }
            catch (error) {
                logger.error('Failed to get dice:', error);
                res.status(500).json({ error: 'Failed to get dice', errorMessage: error });
            }
        };
        this.diceUpdate = async (ws, message) => {
            try {
                await this.diceService.diceUpdate(ws, message);
            }
            catch (error) {
                logger.error('Failed to get dice:', error);
                ws.send(JSON.stringify({ error: 'Failed to update dice in board' }));
            }
        };
    }
}
