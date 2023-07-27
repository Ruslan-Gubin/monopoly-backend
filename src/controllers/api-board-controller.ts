import WebSocket from 'ws';
import { GameBoardService } from '../service/index.js';
import * as DTO from '../dtos/index.js';
import { logger } from '../utils/loger.js';
import { ExtendedWebSocket } from '../types/ExtendedWebSocket.js';
import { IRequestBody, IRequestParams } from '../types/index.js';
import { Response } from 'express-serve-static-core';

export class GameBoardController {
  constructor(private gameBoardService: GameBoardService) {}

  // /** Получаем событие с клиента */
  // handleMessage = (ws: WebSocket, message: any) => {
  //   const method = message?.method

  //   try {
  //     switch(method) {
  //       case 'connection':
  //         this.connectWS(ws, message)
  //       break;
  //       case 'createSession':
  //         this.createSession(ws, message)
  //       break;
  //       case 'removeSession':
  //         this.removeSession(ws, message)
  //       break;
  //       case 'joinSession':
  //         this.joinSession(ws, message)
  //       break;
  //       case 'outSession':
  //         this.outSession(ws, message)
  //       break;
  //       case 'disconect':
  //         this.disconect(ws, message)
  //       break;
  //       default:
  //         throw new Error('Invalid method');
  //     }
  //   } catch (error) {
  //     logger.error('Failed to handle WebSocket message:', error);
  //     ws.send(JSON.stringify({ error: 'Failed to handle WebSocket message' }));
  //   }
  // };


  // /** Подключение пользователя к сокету */
  // private connectWS = async (ws: ExtendedWebSocket | WebSocket, message: DTO.SessionConnectDTO) => {
  //   try {
  //     await this.sessionService.connectedSession((ws as ExtendedWebSocket), message);
  //   } catch (error) {
  //     logger.error('Failed to connect WebSocket:', error);
  //     ws.send(JSON.stringify({ error: 'Failed to connect WebSocket' }));
  //   }
  // };

  /** Создание игровой доски */
  public createBoard = async (req: IRequestBody<DTO.BoardCreateDTO[]>, res: Response): Promise<void> => {
    try {
      const body = req.body;
      const ws = 'ws' as unknown as WebSocket
      const board = await this.gameBoardService.createBoard(body, ws);
      res.status(201).json(board) 
    } catch (error) {
      logger.error('Failed to create board:', error);
      res.status(500).json({ error: 'Failed to create board', errorMessage: error }); 
    }
  };

  /** Найти игровую доску по id */
  public getBoardId = async (req: IRequestParams<{ id: string }>, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const board = await this.gameBoardService.getBoardId(id);
      res.status(201).json(board) 
    } catch (error) {
      logger.error('Failed to create board:', error);
      res.status(500).json({ error: 'Failed to create board', errorMessage: error }); 
    }
  };

  // /** Удаление сессии */
  // private removeSession = async (ws: WebSocket, message: DTO.SessionRemoveDTO): Promise<void> => {
  //   try {
  //     await  this.sessionService.removeSession(ws, message);
  //   } catch (error) {
  //     logger.error('Failed to remove session:', error);
  //     ws.send(JSON.stringify({ error: 'Failed to remove session' }));
  //   }
  // };

  // /** Присоеденится к сессии */
  // private joinSession = async (ws: WebSocket, message: DTO.SessionJoinDTO): Promise<void> => {
  //   try {
  //     await  this.sessionService.joinSession(ws, message.body);
  //   } catch (error) {
  //     logger.error('Failed to join session:', error);
  //     ws.send(JSON.stringify({ error: 'Failed to join session' }));
  //   }
  // };

  // /** Выход из сессии */
  // private outSession = async (ws: WebSocket, message: DTO.SessionOutDTO): Promise<void> => {
  //   try { 
  //     await  this.sessionService.outSession(ws, message.body);
  //   } catch (error) {
  //     logger.error('Failed to leave session:', error);
  //     ws.send(JSON.stringify({ error: 'Failed to leave session' }));
  //   }
  // };

  // /** Пользователь отключается от вэбсокета */
  // private disconect = async (ws: WebSocket, message: DTO.SessionDisconectUserDTO): Promise<void> => {
  //   try {
  //   await  this.sessionService.disconectUser(ws, message.body);
  //   } catch (error) {
  //     logger.error('Failed to disconnect WebSocket:', error);
  //     ws.send(JSON.stringify({ error: 'Failed to disconnect WebSocket' }));
  //   }
  // };

}