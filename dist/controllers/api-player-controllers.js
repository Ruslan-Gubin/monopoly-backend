import { logger } from '../utils/index.js';
export class PlayerController {
    constructor(playerService) {
        this.playerService = playerService;
        this.getBoardPlayers = async (req, res) => {
            try {
                const boardId = req.params.id;
                const players = await this.playerService.getBoardPlayers(boardId);
                res.status(201).json(players);
            }
            catch (error) {
                logger.error('Failed to create user:', error);
                res.status(500).json({ error: 'Failed to create user', errorMessage: error });
            }
        };
    }
}
