import { sessionService } from '../service/sessionService.js';
import { authController } from './api-auth-controlers.js';
import { messageService } from '../service/message-service.js';
import { sessionConfirmationService } from '../service/session-confirmation.js';
class SessionController {
    async wsSession(ws, req) {
        ws.on('message', (msq) => {
            const message = JSON.parse(msq);
            switch (message.method) {
                case 'connection':
                    sessionService.connectedSession(ws, message);
                    authController.setAuthOnline(true, message.id);
                    break;
                case 'createSession':
                    sessionService.createSession(ws, message);
                    break;
                case 'removeSession':
                    sessionService.removeSession(ws, message);
                    break;
                case 'joinSession':
                    sessionService.joinSession(ws, message.body);
                    break;
                case 'outSession':
                    sessionService.outSession(ws, message.body);
                    break;
                case 'disconect':
                    authController.setAuthOnline(false, message.body.id);
                    sessionService.disconectUser(ws, message.body);
                    break;
                case 'createMessage':
                    messageService.createMessage(ws, message.body);
                    break;
                case 'sessionStartConfirmation':
                    sessionConfirmationService.startConfirmation(ws, message.body);
                    break;
                case 'confirmParticipationGame':
                    sessionConfirmationService.confirmGame(ws, message.body);
                    break;
                case 'close':
                    break;
            }
        });
    }
}
export const sessionController = new SessionController();
