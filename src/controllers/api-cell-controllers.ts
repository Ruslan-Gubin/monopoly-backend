import { Response } from 'express-serve-static-core';
import { IRequestBody, IRequestParams } from '../types/IRequestRespons/index.js';

import { CellService } from '../service/index.js';
import * as DTO from '../dtos/index.js';
import { logger } from '../utils/index.js';

export class CellController {
  constructor(private cellService: CellService) {}

  /** Создание клетки */
  createCell = async (req: IRequestBody<DTO.CellCreateDTO>, res: Response) => {
    try {
      const body = req.body;
      const newCell = await this.cellService.create(body);
      res.status(201).json(newCell);
    } catch (error) {
      logger.error('Failed to create user:', error);
      res.status(500).json({ error: 'Failed to create user', errorMessage: error });
    }
  };

  /** Получит все клетки по названию игрового поля */
  getAllCell = async (req: IRequestParams<DTO.GetAllCellDTO>, res: Response) => {
    try {
      const boardName = req.params.board_name
      const cells = await this.cellService.getAllCells(boardName);
      res.status(201).json(cells);
    } catch (error) {
      logger.error('Failed to create user:', error);
      res.status(500).json({ error: 'Failed to create user', errorMessage: error });
    }
  };

 
}
