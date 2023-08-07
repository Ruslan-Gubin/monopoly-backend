import WebSocket from 'ws';
import * as DTO from '../dtos/index.js';
import { logger } from '../utils/loger.js';
import { GameOverService } from '../service/index.js';

export class GameOverController {
  constructor(private gameOverService: GameOverService) {}

  /** Получаем событие с клиента */
  handleMessage = (ws: WebSocket, message: any) => {
    const method = message?.method

    try {
      switch(method) {
        case 'playerGameOver':
          this.playerGameOver(ws, message)
        break;    
        default:
          throw new Error('Invalid method');
      }
    } catch (error) {
      logger.error('Failed to handle WebSocket message:', error);
      ws.send(JSON.stringify({ error: 'Failed to handle WebSocket message' }));
    }
  };


  /** Игрок банкрот */
  private playerGameOver = async (ws: WebSocket, message: DTO.GameOverPropsDTO) => {
    try {
      await this.gameOverService.playerGameOver(ws, message);
    } catch (error) {
      logger.error('Failed to connect WebSocket:', error);
      ws.send(JSON.stringify({ error: 'Failed to connect WebSocket' }));
    }
  };
}