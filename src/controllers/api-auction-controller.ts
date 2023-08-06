import WebSocket from 'ws';
import * as DTO from '../dtos/index.js';
import { logger } from '../utils/loger.js';
import { AuctionService } from '../service/index.js';

export class AuctionController {
  constructor(private auctionService: AuctionService) {}

  /** Получаем событие с клиента */
  handleMessage = (ws: WebSocket, message: any) => {
    const method = message?.method

    try {
      switch(method) {
        case 'auctionRefresh':
          this.auctionRefresh(ws, message)
        break;     
        default:
          throw new Error('Invalid method');
      }
    } catch (error) {
      logger.error('Failed to handle WebSocket message:', error);
      ws.send(JSON.stringify({ error: 'Failed to handle WebSocket message' }));
    }
  };


  /** Обьявляется аукцион */
  private auctionRefresh = async (ws: WebSocket, message: DTO.AuctionRefreshDTO) => {
    try {
      await this.auctionService.auctionRefresh(ws, message);
    } catch (error) {
      logger.error('Failed to connect WebSocket:', error);
      ws.send(JSON.stringify({ error: 'Failed to connect WebSocket' }));
    }
  };
}