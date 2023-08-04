import { CellModel } from '../models/index.js';
import { logger } from '../utils/index.js';
export class CellService {
    constructor({ cache }) {
        this.allCellsKey = 'allCells';
        this.model = CellModel;
        this.cache = cache;
    }
    async create(body) {
        try {
            if (!body) {
                throw new Error('Failed to not found body in create new cell service');
            }
            const rowId = body.position_matrix_row;
            const columnId = body.position_matrix_column;
            const newCell = await new this.model({
                ...body,
                position_matrix: {
                    row_index: rowId,
                    column_index: columnId,
                }
            }).save();
            return newCell;
        }
        catch (error) {
            logger.error('Failed to create new cell in service:', error);
            return { error, text: 'Failed to create new cell in service' };
        }
    }
    async getAllCells(board_name) {
        try {
            if (!board_name) {
                throw new Error('Failed to not found board name in service');
            }
            let cellsCache = (this.cache.getValueInKey(this.allCellsKey + board_name));
            if (!cellsCache) {
                const allCellsDB = await this.model.find({ board_name }).sort({ position: 1 });
                cellsCache = allCellsDB;
                this.cache.addKeyInCache(this.allCellsKey + board_name, allCellsDB);
            }
            return cellsCache;
        }
        catch (error) {
            logger.error('Failed to get all cells in service:', error);
            return { error, text: 'Failed to get all cells in service' };
        }
    }
    async getCell(id) {
        try {
            if (!id) {
                throw new Error('Failed to  position  in get getCell');
            }
            let cellCache = this.cache.getValueInKey(id);
            if (!cellCache) {
                cellCache = await this.model.findById(id);
                this.cache.addKeyInCache(id, cellCache);
            }
            return cellCache;
        }
        catch (error) {
            logger.error('Failed to get cell in service:', error);
        }
    }
}
