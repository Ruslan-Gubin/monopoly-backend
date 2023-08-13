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
        case 'removeGame':
          this.removeGame(message.body.board_id)
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

  /** Игра окончена удаляем все что связано с игрой по вебсокету без ответа */
   removeGame = async (board_id: string) => {
    try {
      await this.gameOverService.removeGame(board_id);
    } catch (error) {
      logger.error('Failed to connect WebSocket:', error);
    }
  };
}