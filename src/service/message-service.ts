import { Model, UpdateWriteOpResult } from 'mongoose';
import { MessageModel } from '../models/index.js';
import * as types from '../types/index.js';
import { broadcastConnection } from '../utils/broadcastConnection.js';

class MessageService {
  id = 555;
  constructor(private readonly model: Model<types.IMessage>) {}

  async createMessage(ws: any, body: types.MessageCreateReq) {
    if (!body) {
      throw new Error('Не получены данные нового пользователя');
    }

    const newMessage = await this.model.create({
      ...body,
    });

    const broadData = {
      method: 'createMessage',
      newMessage,
    };

    broadcastConnection(this.id, ws, broadData);
  }

  async getMessages(): Promise<types.IMessage[]> {
    return await this.model.find({}).sort({ createdAt: -1 });
  }
}

export const messageService = new MessageService(MessageModel);
