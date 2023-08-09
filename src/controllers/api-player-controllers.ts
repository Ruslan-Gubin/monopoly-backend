import { Response } from 'express-serve-static-core';
import { IRequestQuery } from '../types/IRequestRespons/index.js';
import {  PlayerService } from '../service/index.js';
import { logger } from '../utils/index.js';

export class PlayerController {
  constructor(private playerService: PlayerService) {}


  /** Получит игроков по id игрового поля */
  getBoardPlayers = async (req: IRequestQuery<{ players: string[] }>, res: Response) => {
    try {
      const players = req.query.players
      const playersBoard = await this.playerService.getBoardPlayers(players);
      res.status(201).json(playersBoard);
    } catch (error) {
      logger.error('Failed to create user:', error);
      res.status(500).json({ error: 'Failed to create user', errorMessage: error });
    }
  };
 
}
