import WebSocket from 'ws';
import { PropertyActionService } from '../service/index.js';
import * as DTO from '../dtos/index.js';
import { logger } from '../utils/loger.js';


export class PropertyActionController {
  constructor(private gameBoardService: PropertyActionService) {}

  /** Получаем событие с клиента */
  handleMessage = (ws: WebSocket, message: any) => {
    const method = message?.method

    try {
      switch(method) { 
        case 'buyProperty':
            this.buyProperty(ws, message)
        break;     
          case 'updateProperty':
          this.updateProperty(ws, message) 
        break;     
        case 'mortgageProperty':
          this.mortgageProperty(ws, message)
        break;
        default:
          throw new Error('Invalid method');
      }
    } catch (error) {
      logger.error('Failed to handle WebSocket message:', error);
      ws.send(JSON.stringify({ error: 'Failed to handle WebSocket message' }));
    }
  };


  /** Пользователь покупает собственность*/
  private buyProperty = async (ws: WebSocket, message: DTO.BoardBuyPropertyDTO): Promise<void> => {
    try {
    await  this.gameBoardService.buyProperty(ws, message);
    } catch (error) {
      logger.error('Failed to buy property:', error);
      ws.send(JSON.stringify({ error: 'Failed to buy property' }));
    }
  };

  /** Игрок делает улучшение собственности */
  private updateProperty = async (ws: WebSocket, message: DTO.UpdatePropertyDTO): Promise<void> => {
    try {
    await  this.gameBoardService.updateProperty(ws, message);
    } catch (error) {
      logger.error('Failed to pay tax:', error);
      ws.send(JSON.stringify({ error: 'Failed to pay tax' }));
    }
  };

  /** Игрок закладывает или выкупает собственность */
  private mortgageProperty = async (ws: WebSocket, message: DTO.UpdatePropertyDTO): Promise<void> => {
    try {
    await  this.gameBoardService.mortgageProperty(ws, message);
    } catch (error) {
      logger.error('Failed to pay tax:', error);
      ws.send(JSON.stringify({ error: 'Failed to pay tax' }));
    }
  };

}