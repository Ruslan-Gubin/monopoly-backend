import { WebSocket } from 'ws';
import { SessionService } from './session-service.js';
import { broadcastConnection, logger } from '../utils/index.js';
import * as DTO from '../dtos/index.js';

export class SessionConfirmationService {
  private id: number;
  private sessionService: SessionService;

  constructor({ sessionService, sessionId }: { sessionService: SessionService; sessionId: number }) {
    this.id = sessionId;
    this.sessionService = sessionService;
  }

  async startConfirmation(
    ws: WebSocket,
    body: DTO.StartConfirmationDTO,
  ): Promise<void | { error: unknown; text: string }> {
    try {
      if (!body.sessionId) {
        throw new Error('Failed to sessionId undefined');
      }

      const sessionId = body.sessionId;

      await this.sessionService.setConfirmSession(sessionId, true);
      const session = await this.sessionService.getOneSession(sessionId);
      const sessions = await this.sessionService.getAllSessions();

      if (!session || !sessions) {
        throw new Error('Не найдена сессия');
      }

      const broadData = {
        method: 'sessionStartConfirmation',
        players: session.players,
        sessionId: session._id,
        sessions,
      };

      broadcastConnection(this.id, ws, broadData);
    } catch (error) {
      logger.error('Failed to start confirmation service:', error);
      return { error, text: 'Failed to start confirmation service' };
    }
  }

  async confirmGame(ws: WebSocket, body: DTO.ConfirmGameDTO): Promise<void | { error: unknown; text: string }> {
    try {
      const { authId, sessionId } = body;

      if (!authId || !sessionId) {
        throw new Error('Failed to auhtId or sessionId not found');
      }

      const broadData = {
        method: 'confirmParticipationGame',
        player: authId,
        sessionId: sessionId,
      };

      broadcastConnection(this.id, ws, broadData);
    } catch (error) {
      logger.error('Failed to confirm game service:', error);
      return { error, text: 'Failed to confirm game service' };
    }
  }

  async cancelParticipationGame(ws: WebSocket, body: DTO.CancelParticipationGameDTO) {
    try {
      const { authId, sessionId, authName } = body;

      if (!authId || !sessionId || !authName) {
        throw new Error('Failed to auhtId or sessionId or authName not found');
      }

      await this.sessionService.setConfirmSession(sessionId, false);

      const sessions = await this.sessionService.getAllSessions();

      if (!sessions) {
        throw new Error('Failed to get all sessions in service');
      }

      const broadData = {
        method: 'cancelParticipationGame',
        player: authId,
        sessionId: sessionId,
        authName,
        sessions,
      };

      broadcastConnection(this.id, ws, broadData);
    } catch (error) {
      logger.error('Failed to cancel participation service:', error);
      return { error, text: 'Failed to cancel participation service:' };
    }
  }
}
