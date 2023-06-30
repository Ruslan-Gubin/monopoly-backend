import { broadcastConnection } from '../utils/broadcastConnection.js';
import { sessionService } from './sessionService.js';
class SessionConfirmationService {
    constructor() {
        this.id = 555;
    }
    async startConfirmation(ws, body) {
        if (!body.sessionId) {
            throw new Error('Не получен ID сессии');
        }
        const sessionId = body.sessionId;
        const session = await sessionService.getOneSession(sessionId);
        if (!session) {
            throw new Error('Не найдена сессия');
        }
        const broadData = {
            method: 'sessionStartConfirmation',
            players: session.players,
            sessionId: session._id
        };
        broadcastConnection(this.id, ws, broadData);
    }
    async confirmGame(ws, body) {
        const { authId, sessionId } = body;
        const broadData = {
            method: 'confirmParticipationGame',
            player: authId,
            sessionId: sessionId
        };
        broadcastConnection(this.id, ws, broadData);
    }
}
export const sessionConfirmationService = new SessionConfirmationService();
