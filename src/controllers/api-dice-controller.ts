import { Response } from 'express-serve-static-core';
import { IRequestParams } from '../types/IRequestRespons/index.js';
import {  DiceService } from '../service/index.js';
import { logger } from '../utils/index.js';

export class DiceController {
  constructor(private diceService: DiceService) {}

  /** Получить dice по id игрового поля */
  getDiceInBoard = async (req: IRequestParams<{ id: string }>, res: Response) => {
    try {
      const diceId = req.params.id
      const dice = await this.diceService.getDiceInBoard(diceId);
      res.status(201).json(dice);
    } catch (error) {
      logger.error('Failed to get dice:', error);
      res.status(500).json({ error: 'Failed to get dice', errorMessage: error });
    }
  };
 
}