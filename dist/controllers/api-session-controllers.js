import { logger } from '../utils/loger.js';
export class SessionController {
    constructor(sessionService) {
        this.sessionService = sessionService;
        this.handleMessage = (ws, message) => {
            const method = message === null || message === void 0 ? void 0 : message.method;
            try {
                switch (method) {
                    case 'connection':
                        this.connectWS(ws, message);
                        break;
                    case 'createSession':
                        this.createSession(ws, message);
                        break;
                    case 'removeSession':
                        this.removeSession(ws, message);
                        break;
                    case 'joinSession':
                        this.joinSession(ws, message);
                        break;
                    case 'outSession':
                        this.outSession(ws, message);
                        break;
                    case 'disconect':
                        this.disconect(ws, message);
                        break;
                    default:
                        throw new Error('Invalid method');
                }
            }
            catch (error) {
                logger.error('Failed to handle WebSocket message:', error);
                ws.send(JSON.stringify({ error: 'Failed to handle WebSocket message' }));
            }
        };
        this.connectWS = async (ws, message) => {
            try {
                await this.sessionService.connectedSession(ws, message);
            }
            catch (error) {
                logger.error('Failed to connect WebSocket:', error);
                ws.send(JSON.stringify({ error: 'Failed to connect WebSocket' }));
            }
        };
        this.createSession = async (ws, message) => {
            try {
                await this.sessionService.createSession(ws, message);
            }
            catch (error) {
                logger.error('Failed to create session:', error);
                ws.send(JSON.stringify({ error: 'Failed to create session' }));
            }
        };
        this.removeSession = async (ws, message) => {
            try {
                await this.sessionService.removeSession(ws, message);
            }
            catch (error) {
                logger.error('Failed to remove session:', error);
                ws.send(JSON.stringify({ error: 'Failed to remove session' }));
            }
        };
        this.joinSession = async (ws, message) => {
            try {
                await this.sessionService.joinSession(ws, message.body);
            }
            catch (error) {
                logger.error('Failed to join session:', error);
                ws.send(JSON.stringify({ error: 'Failed to join session' }));
            }
        };
        this.outSession = async (ws, message) => {
            try {
                await this.sessionService.outSession(ws, message.body);
            }
            catch (error) {
                logger.error('Failed to leave session:', error);
                ws.send(JSON.stringify({ error: 'Failed to leave session' }));
            }
        };
        this.disconect = async (ws, message) => {
            try {
                await this.sessionService.disconectUser(ws, message.body);
            }
            catch (error) {
                logger.error('Failed to disconnect WebSocket:', error);
                ws.send(JSON.stringify({ error: 'Failed to disconnect WebSocket' }));
            }
        };
    }
}
