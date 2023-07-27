import { logger } from '../utils/loger.js';
export class GameBoardController {
    constructor(gameBoardService) {
        this.gameBoardService = gameBoardService;
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
    }
}
