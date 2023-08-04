import { logger } from '../utils/index.js';
export class PlayerController {
    constructor(playerService) {
        this.playerService = playerService;
        this.getBoardPlayers = async (req, res) => {
            try {
                const players = req.query.players;
                const playersBoard = await this.playerService.getBoardPlayers(players);
                res.status(201).json(playersBoard);
            }
            catch (error) {
                logger.error('Failed to create user:', error);
                res.status(500).json({ error: 'Failed to create user', errorMessage: error });
            }
        };
    }
}
