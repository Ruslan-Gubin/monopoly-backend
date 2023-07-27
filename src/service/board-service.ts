import { Model } from 'mongoose';
import { WebSocket } from 'ws';
import { GameBoardModel } from '../models/index.js';
import { CacheManager, broadcastConnection, logger, randomValue } from '../utils/index.js';
import * as DTO from '../dtos/index.js';
import * as types from '../types/index.js';
import { cellService } from '../routes/api-cellRoutes.js';
import { diceService, playerService } from '../routes/index.js';
import { ExtendedWebSocket } from '../types/index.js';
import { SESSION_ID } from '../config/web-socked.js';


export class GameBoardService {
  private readonly model: Model<types.IGameBoard>;
  private readonly allGameBoardKey = 'allGameBoard';
  private cache: CacheManager<types.IGameBoard | types.IGameBoard[]>;

  constructor({
    cache,
  }: {
    cache: CacheManager<types.IGameBoard>;
  }) {
    this.model = GameBoardModel;
    this.cache = cache;
  }

  async createBoard(body: DTO.BoardCreateDTO[], ws: WebSocket) {
    try {
      if (!body) {
        throw new Error('Failed body in create board service');
      }

      const newPlayers = await playerService.createPlayers(body)
      const newDice = await diceService.createDice()

      if (typeof newPlayers === 'string') {
        throw new Error(newPlayers);
      }

      if (typeof newDice === 'string') {
        throw new Error(newDice);
      }

      const playersNameList = newPlayers.map(player => player.name).join(' ')
      const randomPlayer = randomValue(0, newPlayers.length)

      const newBoard = await this.model.create({ 
        currentPlayerId: newPlayers[randomPlayer]._id,
        players: newPlayers,
        dice: newDice,
      });

      if (!newBoard) throw new Error('Failed create board in service');

      await playerService.setBoardIdInPlaers(newPlayers, newBoard._id)

      const id = newBoard._id.toString()
      this.cache.addKeyInCache(id, newBoard)

        const broadData = { 
        method: 'createGameBoard',
        title: `Игроки ${playersNameList} перемещаются на игровое поле`,
        board_id: newBoard._id,
        user_id: newPlayers.map(player => player.user_id)
      };
    
      broadcastConnection(SESSION_ID, ws, broadData);
      return newBoard._id
    } catch (error) {
      logger.error('Failed to create game board in service:', error);
      return { error, text: 'Failed to create game board in service' };
    }
  }

  async getBoardId(boardId: string) {
      try {
        if (!boardId) {
          throw new Error('Failed get board id in params service')
        }

        let boardCache = this.cache.getValueInKey(boardId)

        if (!boardCache) {
          boardCache = await this.model.find({_id: boardId})
          this.cache.addKeyInCache(boardId, boardCache)
        }

        if (!boardCache) {
          throw new Error('Failed get board in service')
        }
        
        return boardCache
      } catch (error) {
        logger.error('Failed to get  game board in service:', error);
        return { error, text: 'Failed to get  game board in service' };  
      }
  }

  async deleteAll() {
    const allEntity = await this.model.find({})
    for(const board of allEntity) {
      await this.model.findByIdAndDelete(board._id)
    }
  }

  // async connectedGameBoard(ws: types.ExtendedWebSocket, message: DTO.SessionConnectDTO) {
  //   try {
  //     ws.id = this.sessionId;

  //     const sessions = await this.getAllSessions();

  //     if (!sessions) {
  //       throw new Error('Failed to get all sessions');
  //     }

  //     ws.send(JSON.stringify({ method: 'connectData', data: sessions }));

  //     const selectionMessages = await this.messageService.getMessages();

  //     const broadData = {
  //       method: 'connectedUser',
  //       title: `Пользователь ${message.fullName} подключен`,
  //       messages: selectionMessages,
  //     };

  //     broadcastConnection(this.sessionId, ws, broadData);
  //   } catch (error) {
  //     logger.error('Failed to connection session:', error);
  //     return { error, text: 'Failed to connection sessio' };
  //   }
  // }

  // async disconectUser(ws: WebSocket, body: DTO.SessionDisconectBodyDTO) {
  //   try {
  //     const { fullName, id, owner, joinSession } = body;
  //     let removeSession;
  //     let outSession;

  //     let sessionsCache = this.getSessionsCache();
  //     if (owner) {
  //       removeSession = await this.model.findByIdAndDelete(owner);
  //       if (sessionsCache) {
  //         sessionsCache = sessionsCache.filter((session) => session.owner !== id);
  //         this.cache.addKeyInCache(this.allSessionKey, sessionsCache);
  //       }
  //     }
  //     if (joinSession) {
  //       const sessionUpdate = await this.model.findByIdAndUpdate(
  //         joinSession,
  //         { $pull: { players: { id: id } } },
  //         { returnDocument: 'after' },
  //       );
  //       if (!sessionUpdate) {
  //         throw new Error('Failed to disconect and update session in service');
  //       }
  //       outSession = sessionUpdate;
  //       if (sessionsCache) {
  //         sessionsCache.forEach((session) => {
  //           if (session._id === joinSession) {
  //             session.players = sessionUpdate.players;
  //           }
  //         });
  //       }
  //     }

  //     const broadData = {
  //       method: 'disconectUser',
  //       title: `Пользователь ${fullName} отключился`,
  //       outUserId: id,
  //       removeSessionId: removeSession,
  //       outSession,
  //     };

  //     broadcastConnection(this.sessionId, ws, broadData);
  //   } catch (error) {
  //     logger.error('Failed to disconect user  session in service:', error);
  //     return { error, text: 'Failed to disconect user  session in service' };
  //   }
  // }

  // async removeSession(ws: WebSocket, message: DTO.SessionRemoveDTO) {
  //   try {
  //     if (!message.method || !message.fullName || !message.id) {
  //       throw new Error('Failed to body method or fullName or id in remove session');
  //     }
  //     const { fullName, id, method } = message;

  //     const removeSession = await this.model.findByIdAndDelete(id);

  //     if (!removeSession) {
  //       throw new Error('Failed to remove session in service');
  //     }
  //     let sessionsCache = this.getSessionsCache();

  //     if (!sessionsCache) {
  //       throw new Error('Failed to remove session in cache is null');
  //     }

  //     sessionsCache = sessionsCache.filter((session) => session._id !== removeSession._id.toString());
  //     this.cache.addKeyInCache(this.allSessionKey, sessionsCache);

  //     const boardData = {
  //       method: method,
  //       id: removeSession._id,
  //       fullName: fullName,
  //     };

  //     broadcastConnection(this.sessionId, ws, boardData);
  //   } catch (error) {
  //     logger.error('Failed to remove session in service:', error);
  //     return { error, text: 'Failed to remove session in service' };
  //   }
  // }

  // async getAllSessions(): Promise<types.ISession[] | types.IReturnErrorObj> {
  //   try {
  //     let sessionsCache = this.getSessionsCache();

  //     if (!sessionsCache) {
  //       const sessions = await this.model.find({}).sort({ createdAt: -1 });
  //       sessionsCache = sessions;
  //       this.cache.addKeyInCache(this.allSessionKey, sessions);
  //     }

  //     return sessionsCache;
  //   } catch (error) {
  //     logger.error('Failed to create message:', error);
  //     return { error, text: 'Failed to create messages in service' };
  //   }
  // }

  // async joinSession(ws: WebSocket, body: DTO.SessionJoinBodyDTO) {
  //   try {
  //     if (!body) {
  //       throw new Error('Failed to not body in out session service');
  //     }

  //     const { sessionId, id, fullName, img } = body;

  //     const updateSession = await this.model.findByIdAndUpdate(
  //       sessionId,
  //       { $addToSet: { players: body } },
  //       { returnDocument: 'after' },
  //     );

  //     if (!updateSession) {
  //       throw new Error('Не удалось добавить пользователя');
  //     }

  //     const sessionsCache = this.getSessionsCache();
  //     sessionsCache?.forEach((session) => {
  //       if (session._id === sessionId) {
  //         session.players.push({ id, fullName, img });
  //       }
  //     });

  //     const boardData = {
  //       method: 'joinSession',
  //       joinUserId: id,
  //       sessionId: updateSession._id,
  //       data: { ...updateSession._doc },
  //     };

  //     broadcastConnection(this.sessionId, ws, boardData);
  //   } catch (error) {
  //     logger.error('Failed to out session in service:', error);
  //     return { error, text: 'Failed to out session in service' };
  //   }
  // }

  // async outSession(ws: WebSocket, body: DTO.SessionOutBodyDTO) {
  //   try {
  //     if (!body) {
  //       throw new Error('Failed to not body in out session service');
  //     }

  //     const { sessionId, playerId } = body;

  //     const updateSession = await this.model.findByIdAndUpdate(
  //       sessionId,
  //       { $pull: { players: { id: playerId } } },
  //       { returnDocument: 'after' },
  //     );

  //     if (!updateSession) {
  //       throw new Error('Не удалось удалить пользователя');
  //     }

  //     const sessionsCache = this.getSessionsCache();
  //     sessionsCache?.forEach((session) => {
  //       if (session._id === sessionId) {
  //         session.players = updateSession.players;
  //       }
  //     });

  //     const boardData = {
  //       method: 'uotSession',
  //       outUserId: playerId,
  //       sessionId: updateSession._id,
  //       data: { ...updateSession._doc },
  //     };

  //     broadcastConnection(this.sessionId, ws, boardData);
  //   } catch (error) {
  //     logger.error('Failed to out session in service:', error);
  //     return { error, text: 'Failed to out session in service' };
  //   }
  // }

  // async getOneSession(id: string): Promise<types.ISession | types.IReturnErrorObj> {
  //   try {
  //     if (!id) {
  //       throw new Error('Failed to not ID in get one session service');
  //     }
  //     let findSessionInCache;

  //     let sessionsCache = this.getSessionsCache();

  //     if (sessionsCache) {
  //       findSessionInCache = sessionsCache.find((session) => session._id === id);
  //       if (!findSessionInCache) {
  //         const findSession = await this.model.findById(id);
  //         findSessionInCache = findSession as types.ISession;
  //       }
  //     } else {
  //       throw new Error('Failed to get one session in service');
  //     }

  //     if (!findSessionInCache) {
  //       throw new Error('Failed to get one session in service');
  //     }

  //     return findSessionInCache;
  //   } catch (error) {
  //     logger.error('Failed to get one session in service:', error);
  //     return { error, text: 'Failed to get one session in service' };
  //   }
  // }

  // async setConfirmSession(id: string, value: boolean) {
  //   try {
  //     if (!id) {
  //       throw new Error('Failed to not ID in confirm session service');
  //     }

  //     await this.model.findByIdAndUpdate(id, { isConfirm: value }, { returnDocument: 'after' });

  //     const sessionsCache = this.getSessionsCache();
  //     sessionsCache?.forEach((session) => {
  //       if (session._id === id) {
  //         session.isConfirm = value;
  //       }
  //     });
  //   } catch (error) {
  //     logger.error('Failed to set confirm session in service:', error);
  //     return { error, text: 'Failed to set confirm session in service' };
  //   }
  // }

  private getGameBoardsCache(): types.IGameBoard[] | null {
    return this.cache.getValueInKey(this.allGameBoardKey) as types.IGameBoard[] | null;
  }
}