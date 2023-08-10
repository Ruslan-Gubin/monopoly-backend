import { MessageModel } from '../models/index.js';
import { broadcastConnection } from '../utils/broadcastConnection.js';
import { logger } from '../utils/loger.js';
export class MessageService {
    constructor({ cache, sessionId }) {
        this.allMessagesKey = 'allMessages';
        this.sessionId = sessionId;
        this.model = MessageModel;
        this.cache = cache;
    }
    async createMessage(ws, body) {
        try {
            if (!body) {
                throw new Error('Failed to body undefined');
            }
            const newMessage = await this.model.create({
                ...body,
            });
            let cachedMessages = (this.cache.getValueInKey(this.allMessagesKey));
            if (!cachedMessages) {
                this.cache.addKeyInCache(this.allMessagesKey, [newMessage]);
            }
            else {
                cachedMessages.unshift(newMessage);
            }
            const broadData = {
                method: 'createMessage',
                newMessage,
            };
            broadcastConnection(this.sessionId, ws, broadData);
            return newMessage;
        }
        catch (error) {
            logger.error('Failed to create message:', error);
            return { error, text: 'Failed to create messages in service' };
        }
    }
    async getMessages() {
        try {
            let messagesCache = (this.cache.getValueInKey(this.allMessagesKey));
            if (!messagesCache) {
                const allMessagesDB = await this.model.find({}).sort({ createdAt: -1 });
                messagesCache = allMessagesDB;
                this.cache.addKeyInCache(this.allMessagesKey, allMessagesDB);
            }
            return messagesCache;
        }
        catch (error) {
            logger.error('Failed to get all messages sesvice:', error);
            return { error, text: 'Failed to get all messages in service' };
        }
    }
    async sendMessage(ws, message) {
        try {
            const { text, player_name, ws_id } = message.body;
            const broadData = {
                method: message.method,
                title: `${player_name}: ${text}`,
            };
            broadcastConnection(ws_id, ws, broadData);
        }
        catch (error) {
            logger.error('Failed to get all messages sesvice:', error);
            return { error, text: 'Failed to get all messages in service' };
        }
    }
}
