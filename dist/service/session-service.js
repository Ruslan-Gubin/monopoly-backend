import { SessionModel } from '../models/index.js';
import { broadcastConnection, logger } from '../utils/index.js';
export class SessionService {
    constructor({ messageService, cache, sessionId }) {
        this.allSessionKey = 'allSessions';
        this.sessionId = sessionId;
        this.model = SessionModel;
        this.messageService = messageService;
        this.cache = cache;
    }
    async connectedSession(ws, message) {
        try {
            ws.id = this.sessionId;
            const sessions = await this.getAllSessions();
            if (!sessions) {
                throw new Error('Failed to get all sessions');
            }
            ;
            ws.send(JSON.stringify({ method: 'connectData', data: sessions }));
            const selectionMessages = await this.messageService.getMessages();
            const broadData = {
                method: 'connectedUser',
                title: `Пользователь ${message.fullName} подключен`,
                messages: selectionMessages,
            };
            broadcastConnection(this.sessionId, ws, broadData);
        }
        catch (error) {
            logger.error('Failed to connection session:', error);
            return { error, text: 'Failed to connection sessio' };
        }
    }
    async disconectUser(ws, body) {
        const { fullName, id, owner, joinSession } = body;
        let removeSession;
        let outSession;
        if (owner) {
            removeSession = await this.model.findByIdAndDelete(owner);
        }
        if (joinSession) {
            outSession = await this.model.findByIdAndUpdate(joinSession, { $pull: { players: { id: id } } }, { returnDocument: 'after' });
        }
        const broadData = {
            method: 'disconectUser',
            title: `Пользователь ${fullName} отключился`,
            outUserId: id,
            removeSessionId: removeSession,
            outSession,
        };
        broadcastConnection(this.sessionId, ws, broadData);
    }
    async createSession(ws, message) {
        if (!message) {
            throw new Error('Не получены данные');
        }
        const newSession = await new this.model({
            owner: message.owner,
            players: [
                {
                    fullName: message.fullName,
                    id: message.id,
                    img: message.img
                }
            ]
        }).save();
        if (!newSession)
            return;
        const boardData = {
            method: 'createSession',
            data: { ...newSession._doc },
        };
        broadcastConnection(this.sessionId, ws, boardData);
    }
    async removeSession(ws, message) {
        const removeSession = await this.model.findByIdAndDelete(message.id);
        if (!removeSession)
            return;
        const boardData = {
            method: 'removeSession',
            id: removeSession._id,
            fullName: message.fullName
        };
        broadcastConnection(this.sessionId, ws, boardData);
    }
    async getAllSessions() {
        try {
            let sessionsCache = (this.cache.getValueInKey(this.allSessionKey));
            if (!sessionsCache) {
                const sessions = await this.model
                    .find({})
                    .sort({ createdAt: -1 });
                sessionsCache = sessions;
                this.cache.addKeyInCache(this.allSessionKey, sessions);
            }
            return sessionsCache;
        }
        catch (error) {
            logger.error('Failed to create message:', error);
            return { error, text: 'Failed to create messages in service' };
        }
    }
    async joinSession(ws, body) {
        if (!body) {
            throw new Error('Не получено тело запроса');
        }
        const { sessionId, id } = body;
        const updateSession = await this.model.findByIdAndUpdate(sessionId, { $addToSet: { players: body } }, { returnDocument: 'after' });
        if (!updateSession) {
            throw new Error('Не удалось добавить пользователя');
        }
        ;
        const boardData = {
            method: 'joinSession',
            joinUserId: id,
            sessionId: updateSession._id,
            data: { ...updateSession._doc },
        };
        broadcastConnection(this.sessionId, ws, boardData);
    }
    async outSession(ws, body) {
        if (!body) {
            throw new Error('Не получено тело запроса');
        }
        const { sessionId, playerId } = body;
        const updateSession = await this.model.findByIdAndUpdate(sessionId, { $pull: { players: { id: playerId } } }, { returnDocument: 'after' });
        if (!updateSession) {
            throw new Error('Не удалось удалить пользователя');
        }
        ;
        const boardData = {
            method: 'uotSession',
            outUserId: playerId,
            sessionId: updateSession._id,
            data: { ...updateSession._doc },
        };
        broadcastConnection(this.sessionId, ws, boardData);
    }
    async getOneSession(id) {
        if (!id) {
            throw new Error('Не получено ID запроса');
        }
        const findSession = await this.model.findById(id);
        if (!findSession) {
            throw new Error('Не удалось найти сессию');
        }
        ;
        return findSession;
    }
    async setConfirmSession(id, value) {
        if (!id) {
            throw new Error('Не получено ID запроса');
        }
        await this.model.findByIdAndUpdate(id, { isConfirm: value }, { returnDocument: 'after' });
    }
}
