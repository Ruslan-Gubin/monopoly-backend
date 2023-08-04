import WebSocket from 'ws';
import { Response } from 'express-serve-static-core';
import { IRequestParams } from '../types/IRequestRespons/index.js';
import {  DiceService } from '../service/index.js';
import { logger } from '../utils/index.js';
import * as DTO from '../dtos/index.js';

export class DiceController {
  constructor(private diceService: DiceService) {}

   /** Получаем событие с клиента */
   handleMessage = (ws: WebSocket, message: any) => {
    const method = message?.method

    try {
      switch(method) {
        case 'roolDice':
          this.diceUpdate(ws, message)
        break;
        default:
          throw new Error('Invalid method');
      }
    } catch (error) {
      logger.error('Failed to handle WebSocket message:', error);
      ws.send(JSON.stringify({ error: 'Failed to handle WebSocket message' }));
    }
  };

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

  /** Игрок кидает кости, изменяем значение костей игровой доски */
  diceUpdate = async (ws: WebSocket, message: DTO.UpdateDiceDTO): Promise<void> => {
    try {
       await this.diceService.diceUpdate(ws, message);
    } catch (error) {
      logger.error('Failed to get dice:', error);
      ws.send(JSON.stringify({ error: 'Failed to update dice in board' }));
    }
  };

 
}