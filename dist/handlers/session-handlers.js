import { SESSION_ID } from '../config/index.js';
import * as controllers from '../controllers/index.js';
import * as services from '../service/index.js';
import { nodeCache } from '../utils/index.js';
export const messageService = new services.MessageService({ cache: nodeCache, sessionId: SESSION_ID });
export const sessionService = new services.SessionService({ messageService, cache: nodeCache, sessionId: SESSION_ID });
export const authService = new services.AuthService({ cache: nodeCache });
export const sessionController = new controllers.SessionController(sessionService);
export const messageController = new controllers.MessageController(messageService);
export const confirmationController = new controllers.ConfirmationController(new services.SessionConfirmationService({ sessionService, sessionId: SESSION_ID }));
export const authController = new controllers.AuthController(authService);
export const sessionHandlers = {
    connection: [sessionController.handleMessage, authController.handleMessage],
    createSession: [sessionController.handleMessage],
    removeSession: [sessionController.handleMessage],
    joinSession: [sessionController.handleMessage],
    outSession: [sessionController.handleMessage],
    disconect: [sessionController.handleMessage, authController.handleMessage],
    createMessage: [messageController.handleMessage],
    sessionStartConfirmation: [confirmationController.handleMessage],
    confirmParticipationGame: [confirmationController.handleMessage],
    cancelParticipationGame: [confirmationController.handleMessage],
};
