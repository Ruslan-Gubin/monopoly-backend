import { logger } from '../utils/index.js';
export class CellController {
    constructor(cellService) {
        this.cellService = cellService;
        this.createCell = async (req, res) => {
            try {
                const body = req.body;
                const newCell = await this.cellService.create(body);
                res.status(201).json(newCell);
            }
            catch (error) {
                logger.error('Failed to create user:', error);
                res.status(500).json({ error: 'Failed to create user', errorMessage: error });
            }
        };
        this.getAllCell = async (req, res) => {
            try {
                const boardName = req.params.board_name;
                const cells = await this.cellService.getAllCells(boardName);
                res.status(201).json(cells);
            }
            catch (error) {
                logger.error('Failed to create user:', error);
                res.status(500).json({ error: 'Failed to create user', errorMessage: error });
            }
        };
    }
}
