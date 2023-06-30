import { MessageModel } from '../models/index.js';
import { broadcastConnection } from '../utils/broadcastConnection.js';
class MessageService {
    constructor(model) {
        this.model = model;
        this.id = 555;
    }
    async createMessage(ws, body) {
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
    async getMessages() {
        return await this.model.find({}).sort({ createdAt: -1 });
    }
}
export const messageService = new MessageService(MessageModel);
