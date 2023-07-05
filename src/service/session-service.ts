import { Model } from 'mongoose';
import { WebSocket } from 'ws';
import { SessionModel } from '../models/index.js';
import { MessageService } from './message-service.js';
import { CacheManager, broadcastConnection, logger } from '../utils/index.js';
import * as DTO from '../dtos/index.js';
import * as types from '../types/index.js';

export class SessionService {
  private sessionId: number;
  private messageService: MessageService;
  private readonly model: Model<types.ISession>;
  private readonly allSessionKey = 'allSessions';
  private cache: CacheManager<types.ISession | types.ISession[]>;

  constructor({
    messageService,
    cache,
    sessionId,
  }: {
    messageService: MessageService;
    cache: CacheManager<types.ISession>;
    sessionId: number;
  }) {
    this.sessionId = sessionId;
    this.model = SessionModel;
    this.messageService = messageService;
    this.cache = cache;
  }

  async connectedSession(ws: types.ExtendedWebSocket, message: DTO.SessionConnectDTO) {
    try {
      ws.id = this.sessionId;

      const sessions = await this.getAllSessions();

      if (!sessions) {
        throw new Error('Failed to get all sessions');
      }

      ws.send(JSON.stringify({ method: 'connectData', data: sessions }));

      const selectionMessages = await this.messageService.getMessages();

      const broadData = {
        method: 'connectedUser',
        title: `Пользователь ${message.fullName} подключен`,
        messages: selectionMessages,
      };

      broadcastConnection(this.sessionId, ws, broadData);
    } catch (error) {
      logger.error('Failed to connection session:', error);
      return { error, text: 'Failed to connection sessio' };
    }
  }

  async disconectUser(ws: WebSocket, body: DTO.SessionDisconectBodyDTO) {
    try {
      const { fullName, id, owner, joinSession } = body;
      let removeSession;
      let outSession;

      let sessionsCache = this.getSessionsCache();
      if (owner) {
        removeSession = await this.model.findByIdAndDelete(owner);
        if (sessionsCache) {
          sessionsCache = sessionsCache.filter((session) => session.owner !== id);
          this.cache.addKeyInCache(this.allSessionKey, sessionsCache);
        }
      }
      if (joinSession) {
        const sessionUpdate = await this.model.findByIdAndUpdate(
          joinSession,
          { $pull: { players: { id: id } } },
          { returnDocument: 'after' },
        );
        if (!sessionUpdate) {
          throw new Error('Failed to disconect and update session in service');
        }
        outSession = sessionUpdate;
        if (sessionsCache) {
          sessionsCache.forEach((session) => {
            if (session._id === joinSession) {
              session.players = sessionUpdate.players;
            }
          });
        }
      }

      const broadData = {
        method: 'disconectUser',
        title: `Пользователь ${fullName} отключился`,
        outUserId: id,
        removeSessionId: removeSession,
        outSession,
      };

      broadcastConnection(this.sessionId, ws, broadData);
    } catch (error) {
      logger.error('Failed to disconect user  session in service:', error);
      return { error, text: 'Failed to disconect user  session in service' };
    }
  }

  async createSession(ws: WebSocket, message: DTO.SessionCreateDTO) {
    try {
      if (!message) {
        throw new Error('Не получены данные');
      }

      const newSession = await new this.model({
        owner: message.owner,
        players: [
          {
            fullName: message.fullName,
            id: message.id,
            img: message.img,
          },
        ],
      }).save();

      if (!newSession) return;

      let sessionsCache = this.getSessionsCache();
      const _id = newSession._id.toString();

      const newSessionCache = {
        ...newSession._doc,
        _id,
      } as types.ISession;

      if (!sessionsCache) {
        this.cache.addKeyInCache(this.allSessionKey, [newSessionCache]);
      } else {
        sessionsCache.push(newSessionCache);
      }

      const boardData = {
        method: 'createSession',
        data: { ...newSession._doc },
      };

      broadcastConnection(this.sessionId, ws, boardData);
    } catch (error) {
      logger.error('Failed to create session in service:', error);
      return { error, text: 'Failed to create session in service' };
    }
  }

  async removeSession(ws: WebSocket, message: DTO.SessionRemoveDTO) {
    try {
      if (!message.method || !message.fullName || !message.id) {
        throw new Error('Failed to body method or fullName or id in remove session');
      }
      const { fullName, id, method } = message;

      const removeSession = await this.model.findByIdAndDelete(id);

      if (!removeSession) {
        throw new Error('Failed to remove session in service');
      }
      let sessionsCache = this.getSessionsCache();

      if (!sessionsCache) {
        throw new Error('Failed to remove session in cache is null');
      }

      sessionsCache = sessionsCache.filter((session) => session._id !== removeSession._id.toString());
      this.cache.addKeyInCache(this.allSessionKey, sessionsCache);

      const boardData = {
        method: method,
        id: removeSession._id,
        fullName: fullName,
      };

      broadcastConnection(this.sessionId, ws, boardData);
    } catch (error) {
      logger.error('Failed to remove session in service:', error);
      return { error, text: 'Failed to remove session in service' };
    }
  }

  async getAllSessions(): Promise<types.ISession[] | types.IReturnErrorObj> {
    try {
      let sessionsCache = this.getSessionsCache();

      if (!sessionsCache) {
        const sessions = await this.model.find({}).sort({ createdAt: -1 });
        sessionsCache = sessions;
        this.cache.addKeyInCache(this.allSessionKey, sessions);
      }

      return sessionsCache;
    } catch (error) {
      logger.error('Failed to create message:', error);
      return { error, text: 'Failed to create messages in service' };
    }
  }

  async joinSession(ws: WebSocket, body: DTO.SessionJoinBodyDTO) {
    try {
      if (!body) {
        throw new Error('Failed to not body in out session service');
      }

      const { sessionId, id, fullName, img } = body;

      const updateSession = await this.model.findByIdAndUpdate(
        sessionId,
        { $addToSet: { players: body } },
        { returnDocument: 'after' },
      );

      if (!updateSession) {
        throw new Error('Не удалось добавить пользователя');
      }

      const sessionsCache = this.getSessionsCache();
      sessionsCache?.forEach((session) => {
        if (session._id === sessionId) {
          session.players.push({ id, fullName, img });
        }
      });

      const boardData = {
        method: 'joinSession',
        joinUserId: id,
        sessionId: updateSession._id,
        data: { ...updateSession._doc },
      };

      broadcastConnection(this.sessionId, ws, boardData);
    } catch (error) {
      logger.error('Failed to out session in service:', error);
      return { error, text: 'Failed to out session in service' };
    }
  }

  async outSession(ws: WebSocket, body: DTO.SessionOutBodyDTO) {
    try {
      if (!body) {
        throw new Error('Failed to not body in out session service');
      }

      const { sessionId, playerId } = body;

      const updateSession = await this.model.findByIdAndUpdate(
        sessionId,
        { $pull: { players: { id: playerId } } },
        { returnDocument: 'after' },
      );

      if (!updateSession) {
        throw new Error('Не удалось удалить пользователя');
      }

      const sessionsCache = this.getSessionsCache();
      sessionsCache?.forEach((session) => {
        if (session._id === sessionId) {
          session.players = updateSession.players;
        }
      });

      const boardData = {
        method: 'uotSession',
        outUserId: playerId,
        sessionId: updateSession._id,
        data: { ...updateSession._doc },
      };

      broadcastConnection(this.sessionId, ws, boardData);
    } catch (error) {
      logger.error('Failed to out session in service:', error);
      return { error, text: 'Failed to out session in service' };
    }
  }

  async getOneSession(id: string): Promise<types.ISession | types.IReturnErrorObj> {
    try {
      if (!id) {
        throw new Error('Failed to not ID in get one session service');
      }
      let findSessionInCache;

      let sessionsCache = this.getSessionsCache();

      if (sessionsCache) {
        findSessionInCache = sessionsCache.find((session) => session._id === id);
        if (!findSessionInCache) {
          const findSession = await this.model.findById(id);
          findSessionInCache = findSession as types.ISession;
        }
      } else {
        throw new Error('Failed to get one session in service');
      }

      if (!findSessionInCache) {
        throw new Error('Failed to get one session in service');
      }

      return findSessionInCache;
    } catch (error) {
      logger.error('Failed to get one session in service:', error);
      return { error, text: 'Failed to get one session in service' };
    }
  }

  async setConfirmSession(id: string, value: boolean) {
    try {
      if (!id) {
        throw new Error('Failed to not ID in confirm session service');
      }

      await this.model.findByIdAndUpdate(id, { isConfirm: value }, { returnDocument: 'after' });

      const sessionsCache = this.getSessionsCache();
      sessionsCache?.forEach((session) => {
        if (session._id === id) {
          session.isConfirm = value;
        }
      });
    } catch (error) {
      logger.error('Failed to set confirm session in service:', error);
      return { error, text: 'Failed to set confirm session in service' };
    }
  }

  private getSessionsCache(): types.ISession[] | null {
    return this.cache.getValueInKey(this.allSessionKey) as types.ISession[] | null;
  }
}
