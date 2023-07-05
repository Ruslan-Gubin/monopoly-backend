import { logger } from '../utils/loger.js';
export class ConfirmationController {
    constructor(sessionConfirmationService) {
        this.sessionConfirmationService = sessionConfirmationService;
        this.handleMessage = async (ws, message) => {
            const method = message.method;
            try {
                switch (method) {
                    case 'sessionStartConfirmation':
                        await this.sessionStartConfirmation(ws, message);
                        break;
                    case 'confirmParticipationGame':
                        await this.confirmParticipationGame(ws, message);
                        break;
                    case 'cancelParticipationGame':
                        await this.cancelParticipationGame(ws, message);
                        break;
                }
            }
            catch (error) {
                logger.error('Failed to handle WebSocket message:', error);
                ws.send(JSON.stringify({ error: 'Failed to connect WebSocket' }));
            }
        };
        this.sessionStartConfirmation = async (ws, message) => {
            try {
                await this.sessionConfirmationService.startConfirmation(ws, message.body);
            }
            catch (error) {
                logger.error('Failed to open modal:', error);
                ws.send(JSON.stringify({ error: 'Failed to sessionStartConfirmation' }));
            }
        };
        this.confirmParticipationGame = async (ws, message) => {
            try {
                await this.sessionConfirmationService.confirmGame(ws, message.body);
            }
            catch (error) {
                logger.error('Failed to confirm participation:', error);
                ws.send(JSON.stringify({ error: 'Failed to confirmParticipationGame' }));
            }
        };
        this.cancelParticipationGame = async (ws, message) => {
            try {
                await this.sessionConfirmationService.cancelParticipationGame(ws, message.body);
            }
            catch (error) {
                logger.error('Failed to cancel participation:', error);
                ws.send(JSON.stringify({ error: 'Failed to cancelParticipationGame' }));
            }
        };
    }
}
