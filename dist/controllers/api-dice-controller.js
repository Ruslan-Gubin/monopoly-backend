import { logger } from '../utils/index.js';
export class DiceController {
    constructor(diceService) {
        this.diceService = diceService;
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
    }
}
