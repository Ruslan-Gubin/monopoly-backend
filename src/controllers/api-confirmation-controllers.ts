import WebSocket from 'ws';
import { SessionConfirmationService } from '../service/index.js';
import * as DTO from '../dtos/index.js';
import { logger } from '../utils/loger.js';

export class ConfirmationController {
  constructor(private sessionConfirmationService: SessionConfirmationService) {}
  
  /** Получаем событие с клиента */
  handleMessage = async(ws: WebSocket, message: any) => {
    const method = message.method

    try {
      switch(method) {
        case 'sessionStartConfirmation':
        await  this.sessionStartConfirmation(ws, message)
        break;
        case 'confirmParticipationGame':
        await  this.confirmParticipationGame(ws, message)
        break;
        case 'cancelParticipationGame':
        await  this.cancelParticipationGame(ws, message)
        break;
      }
    } catch (error) {
      logger.error('Failed to handle WebSocket message:', error);
      ws.send(JSON.stringify({ error: 'Failed to connect WebSocket' }));
    }
  };

  /** Открывается модальное окно с опросом готовности к игре */
  private sessionStartConfirmation = async (ws: WebSocket, message: DTO.SessionStartConfirmationDTO): Promise<void> => {
    try {
      await  this.sessionConfirmationService.startConfirmation(ws, message.body);
    } catch (error) {
      logger.error('Failed to open modal:', error);
      ws.send(JSON.stringify({ error: 'Failed to sessionStartConfirmation' }));
    }
  };

  /** Пользователь оповещает о готовности к игре */
  private confirmParticipationGame = async (
    ws: WebSocket,
    message: DTO.SessionConfirmParticipationDTO,
  ): Promise<void> => {
    try {
      await  this.sessionConfirmationService.confirmGame(ws, message.body);
    } catch (error) {
      logger.error('Failed to confirm participation:', error);
      ws.send(JSON.stringify({ error: 'Failed to confirmParticipationGame' }));
    }
  };

  /** Пользователь  не готов к игре */
  private cancelParticipationGame = async (
    ws: WebSocket,
    message: DTO.SessionCancelParticipationDTO,
  ): Promise<void> => {
    try {
      await  this.sessionConfirmationService.cancelParticipationGame(ws, message.body);
    } catch (error) {
      logger.error('Failed to cancel participation:', error);
      ws.send(JSON.stringify({ error: 'Failed to cancelParticipationGame' }));
    }
  };
}