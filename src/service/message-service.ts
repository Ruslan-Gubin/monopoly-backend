import { Model } from 'mongoose';
import { WebSocket } from 'ws';
import { MessageModel } from '../models/index.js';
import * as types from '../types/index.js';
import { broadcastConnection } from '../utils/broadcastConnection.js';
import { CacheManager } from '../utils/index.js';
import { logger } from '../utils/loger.js';
import * as DTO from '../dtos/index.js';


export class MessageService { 
  private readonly allMessagesKey = 'allMessages';
  private sessionId: number;
  private readonly model: Model<types.IMessage>;
  private cache: CacheManager<types.IMessage[] | types.IMessage>;

  constructor( { cache, sessionId }: { cache: CacheManager<types.IMessage[] | types.IMessage>, sessionId: number } ) {
    this.sessionId = sessionId;
    this.model = MessageModel;
    this.cache = cache;
  }

  async createMessage(
    ws: WebSocket,
    body: types.MessageCreateReq,
  ): Promise<types.IMessage | types.IReturnErrorObj> {
    try {
      if (!body) {
        throw new Error('Failed to body undefined');
      }

      const newMessage = await this.model.create({
        ...body,
      });

      let cachedMessages  = (this.cache.getValueInKey(this.allMessagesKey)) as types.IMessage[] | null;
      
      if (!cachedMessages ) {
        this.cache.addKeyInCache(this.allMessagesKey, [newMessage])
      } else { 
        cachedMessages.unshift(newMessage)
      }

      const broadData = {
        method: 'createMessage',
        newMessage,
      };

      broadcastConnection(this.sessionId, ws, broadData);
      return newMessage;
    } catch (error) {
      logger.error('Failed to create message:', error);
      return { error, text: 'Failed to create messages in service' };
    }
  }

  async getMessages(): Promise<types.IMessage[] | types.IReturnErrorObj  > {
    try {
      let messagesCache = (this.cache.getValueInKey(this.allMessagesKey)) as types.IMessage[]

      if (!messagesCache) {
        const allMessagesDB = await this.model.find({}).sort({ createdAt: -1 });
        messagesCache = allMessagesDB
        this.cache.addKeyInCache(this.allMessagesKey, allMessagesDB)
      }
          
      return messagesCache;
    } catch (error) { 
      logger.error('Failed to get all messages sesvice:', error);
      return { error, text: 'Failed to get all messages in service' };
    }
  }

  async sendMessage(ws: WebSocket, message: DTO.GameSendMessageDTO) {
    try {
      const { text, player_name, ws_id } = message.body

      const broadData = {
        method: message.method,
        title: `${player_name}: ${text}`,
      };

      broadcastConnection(ws_id, ws, broadData);
    } catch (error) { 
      logger.error('Failed to get all messages sesvice:', error);
      return { error, text: 'Failed to get all messages in service' };
    }
  }
}
