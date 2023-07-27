import { Response } from 'express-serve-static-core';
import { IRequestParams } from '../types/IRequestRespons/index.js';
import {  PlayerService } from '../service/index.js';
import * as DTO from '../dtos/index.js';
import { logger } from '../utils/index.js';

export class PlayerController {
  constructor(private playerService: PlayerService) {}

  /** Получит игроков по id игрового поля */
  getBoardPlayers = async (req: IRequestParams<{ id: string }>, res: Response) => {
    try {
      const boardId = req.params.id
      const players = await this.playerService.getBoardPlayers(boardId);
      res.status(201).json(players);
    } catch (error) {
      logger.error('Failed to create user:', error);
      res.status(500).json({ error: 'Failed to create user', errorMessage: error });
    }
  };

 
}
