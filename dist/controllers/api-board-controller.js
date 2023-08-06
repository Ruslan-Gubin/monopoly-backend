import { logger } from '../utils/loger.js';
export class GameBoardController {
    constructor(gameBoardService) {
        this.gameBoardService = gameBoardService;
        this.handleMessage = (ws, message) => {
            const method = message === null || message === void 0 ? void 0 : message.method;
            try {
                switch (method) {
                    case 'connection':
                        this.connectWS(ws, message);
                        break;
                    case 'disconect':
                        this.disconect(ws, message);
                        break;
                    case 'pay':
                        this.payPrice(ws, message);
                        break;
                    case 'playerGameOver':
                        console.log(message);
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
        this.connectWS = async (ws, message) => {
            try {
                await this.gameBoardService.connectBoard(ws, message);
            }
            catch (error) {
                logger.error('Failed to connect WebSocket:', error);
                ws.send(JSON.stringify({ error: 'Failed to connect WebSocket' }));
            }
        };
        this.createBoard = async (req, res) => {
            try {
                const body = req.body;
                const ws = 'ws';
                const board = await this.gameBoardService.createBoard(body, ws);
                res.status(201).json(board);
            }
            catch (error) {
                logger.error('Failed to create board:', error);
                res.status(500).json({ error: 'Failed to create board', errorMessage: error });
            }
        };
        this.getBoardId = async (req, res) => {
            try {
                const id = req.params.id;
                const board = await this.gameBoardService.getBoardId(id);
                res.status(201).json(board);
            }
            catch (error) {
                logger.error('Failed to create board:', error);
                res.status(500).json({ error: 'Failed to create board', errorMessage: error });
            }
        };
        this.disconect = async (ws, message) => {
            try {
                await this.gameBoardService.disconectUser(ws, message.body);
            }
            catch (error) {
                logger.error('Failed to disconnect WebSocket:', error);
                ws.send(JSON.stringify({ error: 'Failed to disconnect WebSocket' }));
            }
        };
        this.payPrice = async (ws, message) => {
            try {
                await this.gameBoardService.payPrice(ws, message);
            }
            catch (error) {
                logger.error('Failed to pay tax:', error);
                ws.send(JSON.stringify({ error: 'Failed to pay tax' }));
            }
        };
    }
}
