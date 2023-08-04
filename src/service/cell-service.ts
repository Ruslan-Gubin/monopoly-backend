import { Model } from 'mongoose';
import * as types from '../types/index.js';
import { CellModel } from '../models/index.js';
import * as DTO from '../dtos/index.js';
import { CacheManager, logger } from '../utils/index.js';

export class CellService {
  private readonly allCellsKey = 'allCells';
  private readonly model: Model<types.ICell>;
  private cache: CacheManager<types.ICell[] | types.ICell>;

  constructor({ cache }: { cache: CacheManager<types.ICell> }) {
    this.model = CellModel;
    this.cache = cache;
  }


  async create(body: DTO.CellCreateDTO): Promise<types.ICell | types.IReturnErrorObj> {
    try {
      if (!body) {
        throw new Error('Failed to not found body in create new cell service');
      }

      const rowId = body.position_matrix_row
      const columnId = body.position_matrix_column

      const newCell = await new this.model({
        ...body,
        position_matrix: {
          row_index: rowId,
          column_index: columnId,
        }
      }).save();
      return newCell;
    } catch (error) {
      logger.error('Failed to create new cell in service:', error);
      return { error, text: 'Failed to create new cell in service' };
    }
  }

  async getAllCells(board_name: string): Promise<types.ICell[] | types.IReturnErrorObj> {
    try {
      if (!board_name) {
        throw new Error('Failed to not found board name in service');
      }
      
      let cellsCache = (this.cache.getValueInKey(this.allCellsKey + board_name)) as types.ICell[]
      
      if (!cellsCache) {
        const allCellsDB = await this.model.find({ board_name }).sort({position: 1})
        cellsCache = allCellsDB
        this.cache.addKeyInCache(this.allCellsKey + board_name, allCellsDB)
      }

      return cellsCache;
    } catch (error) {
      logger.error('Failed to get all cells in service:', error);
      return { error, text: 'Failed to get all cells in service' };
    }
  }

  async getCell(id: string) {
    try {
      if (!id) {
        throw new Error('Failed to  position  in get getCell');
      }

      let cellCache = this.cache.getValueInKey(id) as types.ICell
      
      if (!cellCache) {
        cellCache = await this.model.findById(id) as types.ICell
        this.cache.addKeyInCache(id, cellCache)
      }

      return cellCache;
    } catch (error) {
      logger.error('Failed to get cell in service:', error);
    }
  }
 
}