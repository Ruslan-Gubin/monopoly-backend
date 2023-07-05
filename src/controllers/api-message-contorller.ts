import WebSocket from 'ws';
import { 
  MessageService, 
} from '../service/index.js';
import * as DTO from '../dtos/index.js';
import { logger } from '../utils/loger.js';

export class MessageController {
  constructor(private messageService: MessageService) {}
 
  /** Получаем событие с клиента */
  handleMessage = (ws: WebSocket, message: any) => {
    const method = message.method

    try {
      switch(method) {
        case 'createMessage':
          this.createMessage(ws, message)
          break;
        }
    } catch (error) {
      logger.error('Failed to handle WebSocket message:', error);
      ws.send(JSON.stringify({ error: 'Failed to MessageController' }));
    }
  };

  /** Пользователь создает новое сообщение */
  private createMessage = async (ws: WebSocket, message: DTO.SessionCreateMessageDTO): Promise<void> => {
    try {
      await  this.messageService.createMessage(ws, message.body);
    } catch (error) {
      logger.error('Failed to create new message:', error);
      ws.send(JSON.stringify({ error: 'Failed to createMessage' }));
    }
  };

}
