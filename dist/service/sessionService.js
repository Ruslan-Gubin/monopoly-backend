import { sessionModel } from '../models/index.js';
import { aWss } from '../index.js';
const broadcastConnection = (id, ws, message) => {
    aWss.clients.forEach(client => {
        if (id === client.id) {
            client.send(JSON.stringify(message));
        }
    });
};
class SessionService {
    constructor(model) {
        this.model = model;
        this.id = 555;
    }
    async connectedSession(ws, message) {
        ws.id = this.id;
        const sessions = await this.getAllSessions();
        if (!sessions)
            return;
        ws.send(JSON.stringify({ method: 'connectData', data: sessions }));
        const broadData = {
            method: 'connectedUser',
            title: `Пользователь ${message.fullName} подключен`,
        };
        broadcastConnection(this.id, ws, broadData);
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
        broadcastConnection(this.id, ws, broadData);
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
        broadcastConnection(this.id, ws, boardData);
    }
    async removeSession(ws, message) {
        const removeSession = await this.model.findByIdAndDelete(message.id);
        if (!removeSession)
            return;
        const boardData = {
            method: 'removeSession',
            id: removeSession._id
        };
        broadcastConnection(this.id, ws, boardData);
    }
    async getAllSessions() {
        const sessions = await this.model
            .find({})
            .sort({ createdAt: -1 });
        return sessions;
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
        broadcastConnection(this.id, ws, boardData);
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
        broadcastConnection(this.id, ws, boardData);
    }
}
export const sessionService = new SessionService(sessionModel);
