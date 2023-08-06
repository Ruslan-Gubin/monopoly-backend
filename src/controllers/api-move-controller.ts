import WebSocket from 'ws';;
import { MoveService } from '../service/index.js';
import { logger } from '../utils/loger.js';
import * as DTO from '../dtos/index.js';


export class MoveController {
  constructor(private moveService: MoveService) {}

  /** Получаем событие с клиента */
  handleMessage = (ws: WebSocket, message: any) => {
    const method = message?.method

    try {
      switch(method) {
        case 'roolDice':
          this.roolDice(ws, message)
        break;
        case 'finishedMove':
          this.finishedMove(ws, message)
        break;      
        default:
          throw new Error('Invalid method');
      }
    } catch (error) {
      logger.error('Failed to handle WebSocket message:', error);
      ws.send(JSON.stringify({ error: 'Failed to handle WebSocket message' }));
    }
  };


    /** Игрок кидает кости */
    roolDice = async (ws: WebSocket, message: DTO.UpdateDiceDTO): Promise<void> => {
      try {
        await this.moveService.roolDice(ws, message);
      } catch (error) {
        logger.error('Failed to rool dice:', error);
        ws.send(JSON.stringify({ error: 'Failed to rool dice' }));
      }
    };

    /** Игрок завершил движение по доске */
    finishedMove = async (ws: WebSocket, message: DTO.BoardFinishedMoveDTO): Promise<void> => {
      try {
        await this.moveService.finishedMove(ws, message);
      } catch (error) {
        logger.error('Failed to update players finished move:', error);
        ws.send(JSON.stringify({ error: 'Failed to update players finished move:' }));
      }
    };

}