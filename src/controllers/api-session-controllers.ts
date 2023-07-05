import WebSocket from 'ws';
import { SessionService } from '../service/index.js';
import * as DTO from '../dtos/index.js';
import { logger } from '../utils/loger.js';

export class SessionController {
  constructor(private sessionService: SessionService) {}

  
  /** Получаем событие с клиента */
  handleMessage = (ws: WebSocket, message: any) => {
    const method = message?.method

    try {
      switch(method) {
        case 'connection':
          this.connectWS(ws, message)
        break;
        case 'createSession':
          this.createSession(ws, message)
        break;
        case 'removeSession':
          this.removeSession(ws, message)
        break;
        case 'joinSession':
          this.joinSession(ws, message)
        break;
        case 'outSession':
          this.outSession(ws, message)
        break;
        case 'disconect':
          this.disconect(ws, message)
        break;
        default:
          throw new Error('Invalid method');
      }
    } catch (error) {
      logger.error('Failed to handle WebSocket message:', error);
      ws.send(JSON.stringify({ error: 'Failed to handle WebSocket message' }));
    }
  };


  /** Подключение пользователя к сокету */
  private connectWS = async (ws: WebSocket, message: DTO.SessionConnectDTO) => {
    try {
      await this.sessionService.connectedSession(ws, message);
    } catch (error) {
      logger.error('Failed to connect WebSocket:', error);
      ws.send(JSON.stringify({ error: 'Failed to connect WebSocket' }));
    }
  };

  /** Создание сессии */
  private createSession = async (ws: WebSocket, message: DTO.SessionCreateDTO): Promise<void> => {
    try {
      await  this.sessionService.createSession(ws, message);
    } catch (error) {
      logger.error('Failed to create session:', error);
      ws.send(JSON.stringify({ error: 'Failed to create session' }));
    }
  };

  /** Удаление сессии */
  private removeSession = async (ws: WebSocket, message: DTO.SessionRemoveDTO): Promise<void> => {
    try {
      await  this.sessionService.removeSession(ws, message);
    } catch (error) {
      logger.error('Failed to remove session:', error);
      ws.send(JSON.stringify({ error: 'Failed to remove session' }));
    }
  };

  /** Присоеденится к сессии */
  private joinSession = async (ws: WebSocket, message: DTO.SessionJoinDTO): Promise<void> => {
    try {
      await  this.sessionService.joinSession(ws, message.body);
    } catch (error) {
      logger.error('Failed to join session:', error);
      ws.send(JSON.stringify({ error: 'Failed to join session' }));
    }
  };

  /** Выход из сессии */
  private outSession = async (ws: WebSocket, message: DTO.SessionOutDTO): Promise<void> => {
    try { 
      await  this.sessionService.outSession(ws, message.body);
    } catch (error) {
      logger.error('Failed to leave session:', error);
      ws.send(JSON.stringify({ error: 'Failed to leave session' }));
    }
  };

  /** Пользователь отключается от вэбсокета */
  private disconect = async (ws: WebSocket, message: DTO.SessionDisconectUserDTO): Promise<void> => {
    try {
    await  this.sessionService.disconectUser(ws, message.body);
    } catch (error) {
      logger.error('Failed to disconnect WebSocket:', error);
      ws.send(JSON.stringify({ error: 'Failed to disconnect WebSocket' }));
    }
  };

}
