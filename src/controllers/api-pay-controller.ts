import WebSocket from 'ws';
import * as DTO from '../dtos/index.js';
import { logger } from '../utils/loger.js';
import { PayService } from '../service/index.js';

export class PayController {
  constructor(private payService: PayService) {}

  /** Получаем событие с клиента */
  handleMessage = (ws: WebSocket, message: any) => {
    const method = message?.method

    try {
      switch(method) {    
        case 'pay':
          this.payPrice(ws, message)
          break;     
        default:
          throw new Error('Invalid method');
      }
    } catch (error) {
      logger.error('Failed to handle WebSocket message:', error);
      ws.send(JSON.stringify({ error: 'Failed to handle WebSocket message' }));
    }
  };


    /** Пользователь оплачивает нужную сумму */
    private payPrice = async (ws: WebSocket, message: DTO.BoardPayTaxDTO): Promise<void> => {
      try {
      await  this.payService.payPrice(ws, message);
    } catch (error) {
      logger.error('Failed to pay tax:', error);
        ws.send(JSON.stringify({ error: 'Failed to pay tax' }));
      }
    };
}